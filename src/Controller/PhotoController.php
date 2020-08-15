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

/**
 * @Route("/portfolio")
 */
class PhotoController extends AbstractController
{
    /**
     * @Route("/category/{cat}", name="photos_by_cat")
     */
    public function index($cat)
    {

        $photos = $this->_getPhotos($cat);
        $img_dir = $this->getParameter('img_base_dir');
        return $this->render(
            'photo/index.html.twig',
            [
                'controller_name' => 'PhotoController',
                'photos' => $photos,
                'category' => $cat,
                'img_base_dir' => $img_dir
            ]
        );
    }

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

            $photoFileName = $fileUploader->upload($file);
            $this->_addPhoto($metadata, $photoFileName);

            return $this->redirectToRoute('photos_by_cat', ["cat" => $photo->getCategory()->getName()]);
        }

        return $this->render('photo/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }


    private function _getPhotos($catName, $privateAccess = false)
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

    private function _getPhoto($id): Photo
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

    private function _editPhotos($id, $exifs, $tags)
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $photo = $entityManager->getRepository(BlogPost::class)->find($id);
            $photo->setExifs($exifs)->setTags($tags);
        } catch (Exception $e) {
            echo 'Caught exception while updating a photo : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    private function _addPhoto($newPhoto, $filePath)
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            //Insert the field of the new post
            $photo = new Photo();
            $photo->setTitle($newPhoto->getTitle());
            $photo->setDescription($newPhoto->getDescription());
            $photo->setExifs($this->_extractExifs($filePath));
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

    private function _extractExifs($path): array
    {
        // Attempt to read the exif headers
        $values = exif_read_data($path);


        if (!$values) {
            echo 'Error: Unable to read exif headers';
            return [];
        }

        $exifs = [];

        $exifs['shutter'] = isset($values['ExposureTime']) ? $this->_getFloatValue($values['ExposureTime']) . 's' : "n/a";
        $exifs['aperture'] = isset($values['FNumber']) ? 'f/' . $this->_getFloatValue($values['FNumber']) : "n/a";
        $exifs['iso'] = isset($values['ISOSpeedRatings']) ? $values['ISOSpeedRatings'] : 'n/a';
        $exifs['focal'] = isset($values['FocalLength']) ? $this->_getFloatValue($values['FocalLength']) . 'mm' : "n/a";
        $exifs['brand'] = isset($values['Make']) ? $values['Make'] : 'n/a';
        $exifs['model'] = isset($values['Model']) ? $values['Model'] : 'n/a';
        $exifs['date'] = isset($values['DateTimeOriginal']) ? $values['DateTimeOriginal'] : 'n/a';

        return $exifs;
    }

    private function _getFloatValue($s): string
    {
        if (!strpos($s, '/')) {
            return $s;
        } else {
            $numbers = explode("/", $s);

            return $numbers[0] < $numbers[1] ? '1/' . $numbers[1] / $numbers[0] : '' . $numbers[0] / $numbers[1];
        }
    }
}
