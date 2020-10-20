<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Photo;
use Exception;
use App\Form\PhotoType;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Category;
use App\Service\FileUploader;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use App\Service\ObjectEncoder;

class PhotoController extends AbstractController
{

    /**
     * @Route("/gallery/{name}", name="gallery", defaults={"name": null})
     */
    public function gallery($name)
    {
        if (!$name) {
            return $this->render('default/index.html.twig');
        }

        $category = $this->getDoctrine()->getRepository(Category::class)->findFromName($name);
        if ($this->isGranted("access", $category)) {
            return $this->render('default/index.html.twig');
        }

        return $this->redirectToRoute('gallery');
    }

    /**
     * @Route("/api/gallery/{catName}", name="api_photos")
     */
    public function photos($catName, ObjectEncoder $objectEncoder)
    {
        $serializer = $this->get('serializer');
        $category = $this->getDoctrine()->getRepository(Category::class)->findFromName($catName);
        $photos = $category->getPhotos();

        $sphotos = $objectEncoder->encodeObjectToJson($photos);
        return new JsonResponse(json_decode($sphotos));
    }

    

    /**
     * @Route("/img/{path}", name="show_img")
     */
    public function show($path)
    {
        $photo = $this->getDoctrine()->getRepository(Photo::class)->findOneBy(["path" => $path]);

        if (null === $photo) {
            return new Response("File not found.", Response::HTTP_NOT_FOUND);
        }

        if ($photo->getCategory()->getPublic() || $this->isGranted('view', $photo)) {
            $response = new Response();
            $path = $this->getParameter("img_base_dir") . 'img/' . $photo->getPath();
            $response->headers->set("Content-type", mime_content_type($path));
            $response->headers->set('Content-Length', filesize($path));
            $response->setContent(readfile($path));
            $response->setStatusCode(Response::HTTP_OK);
            return $response;
        }
        return new Response("You must log in to access this pictures.", Response::HTTP_FORBIDDEN);
    }

    /**
     * @Route("/admin/dashboard/photos", name="photos_list")
     */
    public function listPhotos(ObjectEncoder $objectEncoder)
    {
        $photos = $this->getDoctrine()->getRepository(Photo::class)->findAll();
        $sphotos = $objectEncoder->encodeObjectToJson($photos);
        return new JsonResponse(json_decode($sphotos));
    }

    /**
     * @Route("/admin/photo/new", name="new_photo")
     */
    public function new(Request $request, FileUploader $fileUploader)
    {
        $photo = new Photo();
        $photo->setTitle('New photo');
        $photo->setDescription("A short description");

        $form = $this->createForm(PhotoType::class, $photo);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $metadata = $form->getData();

            $file = $form->get('path')->getData();

            [$photoFileName, $exifs] = $fileUploader->upload($file);
            $this->_addPhoto($metadata, $photoFileName, $exifs);

            return $this->redirectToRoute('photos_by_cat', ["cat" => $photo->getCategory()->getName()]);
        }

        return $this->render('photo/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }


    /**
     * @Route("/admin/photo/edit/{id}", name="edit_photo")
     */
    public function editPhoto(Request $request, $id)
    {
        $photo = $this->_getPhoto($id);

        $form = $this->createForm(PhotoType::class, $photo);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$task` variable has also been updated
            $newPhoto = $form->getData();
            $this->_editPhotos($id, $newPhoto);

            return $this->redirectToRoute('categories');
        }

        return $this->render('photo/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/admin/photo/delete/{id}", name="delete_photo")
     */
    public function deletePhoto(Request $request, $id)
    {
        return null;
    }
}
