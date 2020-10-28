<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Form\CategoryType;
use App\Service\ObjectEncoder;
use Psr\Log\LoggerInterface;

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
     * @Route("/admin/dashboard/categories/new", methods={"POST"}, name="new_category")
     */
    public function newCategory(Request $request)
    {
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category, array('csrf_protection' => false));
        $form->submit($request->request->all());
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $category = $form->getData();
            $em->persist($category);
            $em->flush();

            $response = new JSONResponse("ok", Response::HTTP_CREATED);
            return $response;
        }

        return new JsonResponse('error', Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/admin/dashboard/categories/edit/{id}", methods={"POST"}, name="edit_category")
     */
    public function editCategory(Request $request, $id)
    {
        $category = $this->getDoctrine()->getRepository(Category::class)->find($id);

        if ($category) {
            $form = $this->createForm(CategoryType::class, $category, array('csrf_protection' => false));
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $category = $form->getData();
                $em->persist($category);
                $em->flush();

                $response = new JSONResponse("ok", Response::HTTP_OK);
                return $response;
            }
        }
        return new JsonResponse('error', Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/admin/dashboard/categories/delete/{id}", methods={"DELETE"}, name="delete_category")
     */
    public function deleteCategory(Request $request, $id)
    {
        // $submittedToken = $request->request->get('token');

        // // 'delete-item' is the same value used in the template to generate the token
        // if ($this->isCsrfTokenValid('delete-item', $submittedToken)) {
        //     // ... do something, like deleting an object
        // }
        $category = $this->getDoctrine()->getRepository(Category::class)->find($id);
        if ($category) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($category);
            $em->flush();
            return new JsonResponse('ok', Response::HTTP_ACCEPTED);
        }


        return new JsonResponse('error', Response::HTTP_EXPECTATION_FAILED);
    }
}
