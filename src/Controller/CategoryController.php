<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;
use Exception;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Form\CategoryType;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Limenius\Liform\Liform;
use Symfony\Component\Serializer\SerializerInterface;

class CategoryController extends AbstractController
{
    /**
     * @Route("/category/new", name="new_category")
     */
    public function newCategory(Request $request)
    {
        $category = new Category();
        $category->setName('Name of the new category ...');
        $category->setPublic(false);

        $form = $this->createForm(CategoryType::class, $category, array('csrf_protection' => false));

        $data = json_decode($request->getContent(), true);
        $form->submit($data);
        if ($form->isSubmitted() && $form->isValid()) {
            // $em = $this->getDoctrine()->getManager();
            // $category = $form->getData();
            // $em->persist($category);
            // $em->flush();

            $response = new JSONResponse("ok", 201);
            return $response;
        }


        $serializer = $this->get('serializer');
        //$initialValues = $serializer->normalize($form);

        return new JsonResponse(["formData"=>'']);
    }

    public function _createCategory($newCategory)
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            $category = new Category();
            $category->setName($newCategory->getName());
            $category->setPublic($newCategory->getPublic());

            //Commit the new entry to the DB
            $entityManager->persist($category);
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while creating a new category : ',  $e->getMessage(), "\n";
            return null;
        }
        return $category;
    }


    public function _getCategories(): array
    {
        try {
            $categories = $this->getDoctrine()->getRepository(Category::class)->findPublic();
        } catch (Exception $e) {
            echo 'Caught exception while getting the photos categories : ',  $e->getMessage(), "\n";
            return [];
        }
        return $categories;
    }
}
