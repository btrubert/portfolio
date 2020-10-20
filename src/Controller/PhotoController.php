<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Photo;
use Exception;
use App\Form\PhotoType;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Category;
use App\Service\FileUploader;

class PhotoController extends AbstractController
{

    /**
     * @Route("/gallery/{category}", name="gallery", defaults={"category": null})
     */
    public function gallery($category)
    {
        if (!$category || ($category && $this->getDoctrine()->getRepository(Category::class)->findFromName($category))) {
            return $this->render('default/index.html.twig');
        } else {
            return $this->redirectToRoute('gallery');
        }
    }


    /**
     * @Route("/api/img/{id}", name="")
     */
    public function show($id)
    {
        $photo = $this->getDoctrine()->getRepository(Photo::class)->find($id);

        if (null === $photo) {
            return new Response(Response::HTTP_NOT_FOUND);
        }

        if ($this->denyAccessUnlessGranted('view', $photo)) {
            return $photo;
        }
        return new Response(Response::HTTP_FORBIDDEN);
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
