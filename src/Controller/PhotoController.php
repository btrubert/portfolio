<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Photo;
use App\Entity\Categorie;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class PhotoController extends AbstractController
{
    /**
     * @Route("/photo", name="photo")
     */
    public function index()
    {
        return $this->render(
            'photo/index.html.twig',
            [
                'controller_name' => 'PhotoController',
            ]
        );
    }


    private function _getPhotos($catName, $privatePhotos = false): array
    {
        try {
            $q = $this->createQueryBuilder('c')
                ->where('private=:private')
                ->setParameter('private', $privatePhotos);

            $query = $q->getQuery();

            $categoriy = $query->execute();
            $photos = $categoriy->getPhotos();
        } catch (Exception $e) {
            echo 'Caught exception while retrieving the photos from a category : ',  $e->getMessage(), "\n";
            return null;
        }
        return $photos;
    }

    private function _getPhoto($id): Photo
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $photo = $entityManager->getRepository(BlogPost::class)->find($id);
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

    private function _addPhoto($file, $metadata)
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            //Insert the field of the new post
            $photo = new Photo();
            $photo->setTitle($metadata['title']);
            $photo->setDescription($metadata['description']);
            $photo->setExifs(_extractExifs($file));
            $photo->setCategory($metadata['category']);
            $metadata['category']->addPhoto($photo);
            $photo->setPath($file);

            //Commit the new entry to the DB
            $entityManager->persist($photo);
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while adding a new photo : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    private function _extractExifs($file): array
    {
        $fp = fopen($file, 'rb');

        if (!$fp) {
            echo 'Error: Unable to open image for reading';
            exit;
        }

        // Attempt to read the exif headers
        $values = exif_read_data($fp);

        if (!$values) {
            echo 'Error: Unable to read exif headers';
            exit;
        }

        $exifs = [];

        $exifs['shutter'] = isset($values['ExposureTime'])? _getFloatValue($values['ExposureTime']).'s' : "n/a";
        $exifs['aperture'] = isset($values['FNumber'])? 'f/'._getFloatValue($values['FNumber']) : "n/a";
        $exifs['iso'] = isset($values['ISOSpeedRatings'])? $values['ISOSpeedRatings'] : 'n/a';
        $exifs['focal'] = isset($values['FocalLength'])? _getFloatValue($values['FocalLength']).'mm' : "n/a";
        $exifs['brand'] = isset($values['Make'])? $values['Make'] : 'n/a';
        $exifs['model'] = isset($values['Model'])? $values['Model'] : 'n/a';
        $exifs['date'] = isset($values['DateTimeOriginal'])? $values['DateTimeOriginal'] : 'n/a';

        return $exifs;
    }

    private function _getFloatValue($s): string
    {
        if (!strpos($s, '/')) {
            return $s;
        } else {
            $numbers = explode("/", $s);

            return $numbers[0]<$numbers[1]? '1/'.$numbers[1]/$numbers[0]: ''.$numbers[0]/$numbers[1];
        }
    }

}
