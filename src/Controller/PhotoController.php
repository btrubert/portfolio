<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Photo;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use App\Form\PhotoType;
use App\Controller\CategoryController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Category;
use App\Service\FileUploader;
use Symfony\Component\Serializer\SerializerInterface;


class PhotoController extends AbstractController
{

    

    /**
     * @Route("/new", name="new_photo")
     */
    public function new(Request $request, FileUploader $fileUploader)
    {
        $photo = new Photo();
        $photo->setTitle('New photo');
        $photo->setDescription("A short description");

        $form = $this->createForm(PhotoType::class, $photo);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$task` variable has also been updated
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
     * @Route("/photo/edit/{id}", name="edit_photo")
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

    public function _getPhotos($catName, $privateAccess = false)
    {
        try {
            //TODO: privateAccess check authorized user

            $category = $this->getDoctrine()->getRepository(Category::class)->findFromName($catName);
            if ($category) {
                return $category->getPhotos();
            }
            return null;
        } catch (Exception $e) {
            echo 'Caught exception while retrieving the photos from a category : ',  $e->getMessage(), "\n";
            return [];
        }
    }

    public function _getPhoto($id): Photo
    {
        try {
            //Retrieve the blog post
            $photo = $this->getDoctrine()->getRepository(Photo::class)->find($id);
        } catch (Exception $e) {
            echo 'Caught exception while retrieving a photo : ',  $e->getMessage(), "\n";
            return null;
        }
        return $photo;
    }

    public function _editPhotos($id, $newPhoto)
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            //Retrieve the blog post
            $photo = $entityManager->getRepository(Photo::class)->find($id);
            $photo->setTitle($newPhoto->getTitle());
            $photo->setDescription($newPhoto->getDescription());
            $photo->setCategory($newPhoto->getCategory());

            //Commit the updated entry to the DB
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while updating a photo : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    public function _addPhoto($newPhoto, $filePath, $exifs)
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            //Insert the field of the new post
            $photo = new Photo();
            $photo->setTitle($newPhoto->getTitle());
            $photo->setDescription($newPhoto->getDescription());
            $photo->setExifs($exifs);
            $photo->setCategory($newPhoto->getCategory());
            $photo->getCategory()->addPhoto($photo);
            $photo->setPath($filePath);
            
            //Commit the new entry to the DB
            $entityManager->persist($photo);
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while adding a new photo : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

}
