<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Form\CategoryType;

use App\Service\ObjectEncoder;

class CategoryController extends AbstractController
{

    /**
     * @Route("/api/categories", name="api_categories")
     */
    public function categories(ObjectEncoder $objectEncoder)
    {
        $serializer = $this->get('serializer');
        $categories = $this->getDoctrine()->getRepository(Category::class)->findPublic();


        $scategories = $objectEncoder->encodeObjectToJson($categories);

        return new JsonResponse(json_decode($scategories));
    }

    /**
     * @Route("/admin/dashboard/categories", name="categories_list")
     */
    public function listCategories(ObjectEncoder $objectEncoder)
    {
        $categories = $this->getDoctrine()->getRepository(Category::class)->findAll();
        $scategories = $objectEncoder->encodeObjectToJson($categories);
        return new JsonResponse(json_decode($scategories));
    }

    /**
     * @Route("/api/new/category/", methods={"POST"}, name="new_category")
     */
    public function newCategory(Request $request)
    {
        $category = new Category();

        $form = $this->createForm(CategoryType::class, $category, array('csrf_protection' => false));

        $data = json_decode($request->getContent(), true);
        $form->submit($data);
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $category = $form->getData();
            $em->persist($category);
            $em->flush();

            $response = new JSONResponse("ok", 201);
            return $response;
        }

        return new JsonResponse('error', 400);
    }

    /**
     * @Route("/api/edit/category/{:id}", methods={"PUT"}, name="edit_category")
     */
    public function editCategory(Request $request)
    {
        // $category = new Category();

        // $form = $this->createForm(CategoryType::class, $category, array('csrf_protection' => false));

        // $data = json_decode($request->getContent(), true);
        // $form->submit($data);
        // if ($form->isSubmitted() && $form->isValid()) {
        //     $em = $this->getDoctrine()->getManager();
        //     $category = $form->getData();
        //     $em->persist($category);
        //     $em->flush();

        //     $response = new JSONResponse("ok", 201);
        //     return $response;
        // }

        return new JsonResponse('error', 400);
    }

    /**
     * @Route("/api/delete/category/{:id}", methods={"DELETE"}, name="delete_category")
     */
    public function deleteCategory(Request $request)
    {
        $submittedToken = $request->request->get('token');

        // 'delete-item' is the same value used in the template to generate the token
        if ($this->isCsrfTokenValid('delete-item', $submittedToken)) {
            // ... do something, like deleting an object
        }

        return new JsonResponse('error', 400);
    }
}
