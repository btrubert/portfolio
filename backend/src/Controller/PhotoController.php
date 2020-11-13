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
use App\Service\ObjectEncoder;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

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
        $category = $this->getDoctrine()->getRepository(Category::class)->findFromName($catName);
        if ($category && ($category->getPublic() || $this->isGranted("access", $category))) {
            $photos = $category->getPhotos();

            $sphotos = $objectEncoder->encodeObjectToJson($photos);
            return new JsonResponse(json_decode($sphotos));
        } else {
            return new JsonResponse("This category does not exit.", Response::HTTP_NOT_FOUND);
        }
        
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
            $path = $this->getParameter("img_base_dir") . $photo->getPath();
            $response->headers->set("Content-type", mime_content_type($path));
            $response->headers->set("Content-Length", filesize($path));
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
     * @Route("/admin/dashboard/photo/new", methods={"GET", "POST"}, name="new_photo")
     */
    public function newPhoto(Request $request, FileUploader $fileUploader,  CsrfTokenManagerInterface $csrf_token)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("photo_item"));
        }

        $photo = new Photo();
        $form = $this->createForm(PhotoType::class, $photo);
        $form->submit($request->request->all());
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $photo = $form->getData();

            $file = $request->files->get("path");

            $savedFile = $fileUploader->upload($file);
            if ($savedFile) {
                [$originalFilename, $photoFileName, $exifs] = $savedFile;
                $photo->setPath($photoFileName);
                $photo->setOriginalPath($originalFilename);
                $photo->setExifs($exifs);
                $em->persist($photo);
                $em->flush();
                $response = new JsonResponse("The photo has been created.", Response::HTTP_CREATED);
            } else {
                $response = new JsonResponse("The picture has not been saved", Response::HTTP_FORBIDDEN);
            }

            return $response;
        }

        return new JsonResponse("Error while creating the new photo.", Response::HTTP_SERVICE_UNAVAILABLE);
    }


    /**
     * @Route("/admin/dashboard/photo/edit/{id}", methods={"GET", "POST"}, name="edit_photo")
     */
    public function editPhoto(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("photo_item"));
        }

        $photo =  $this->getDoctrine()->getRepository(Photo::class)->find($id);
        if ($photo) {
            $form = $this->createForm(PhotoType::class, $photo);
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $photo = $form->getData();
                $em->persist($photo);
                $em->flush();

                $response = new JSONResponse("The photo has been edited.", Response::HTTP_OK);
                return $response;
            }
        }
        return new JsonResponse('Error while saving the edited photo', Response::HTTP_SERVICE_UNAVAILABLE);
    }

    /**
     * @Route("/admin/dashboard/photo/delete/{id}", methods={"GET", "POST"}, name="delete_photo")
     */
    public function deletePhoto(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("delete_photo_" . $id));
        }

        $submittedToken = $request->request->get('_token');
        if ($this->isCsrfTokenValid('delete_photo_' . $id, $submittedToken)) {
            $photo = $this->getDoctrine()->getRepository(Photo::class)->find($id);
            if ($photo) {
                $em = $this->getDoctrine()->getManager();
                $em->remove($photo);
                $em->flush();
                return new JsonResponse('The photo has been deleted.', Response::HTTP_ACCEPTED);
            }
        }

        return new JsonResponse('Error while deleting the photo.', Response::HTTP_SERVICE_UNAVAILABLE);
    }
}
