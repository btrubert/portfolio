<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Category;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;


/**
 * @Route("/api")
 */
class ApiController extends AbstractController
{
    /**
     * @Route("/categories", name="api_categories")
     */
    public function categories()
    {
        $serializer = $this->get('serializer');
        $categories = $this->getDoctrine()->getRepository(Category::class)->findPublic();

        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                // value returned in the cat object refering $this
                return $object->getId();
            },
        ];
        $normalizer = new ObjectNormalizer(null, null, null, null, null, null, $defaultContext);
        $encoder = new JsonEncoder();

        $serializer = new Serializer([$normalizer], [$encoder]);
        $scategories = $serializer->serialize($categories, 'json');
        
        return new JsonResponse(json_decode($scategories));
    }

    /**
     * @Route("/gallery/{catName}", name="api_photos")
     */
    public function photos($catName)
    {
        $serializer = $this->get('serializer');
        $category = $this->getDoctrine()->getRepository(Category::class)->findFromName($catName);
        $photos = $category->getPhotos();

        $encoder = new JsonEncoder();
        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                // value returned in the cat object refering $this
                return $object->getId();
            },
        ];
        $normalizer = new ObjectNormalizer(null, null, null, null, null, null, $defaultContext);

        $serializer = new Serializer([$normalizer], [$encoder]);
        $sphotos = $serializer->serialize($photos, 'json');


        return new JsonResponse(json_decode($sphotos));
    }
}
