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
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;


class CategoryController extends AbstractController
{

    /**
     * @Route("/api/categories", name="api_categories")
     */
    public function categories(ObjectEncoder $objectEncoder)
    {
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
     * @Route("/admin/dashboard/categories/new", methods={"GET", "POST"}, name="new_category")
     */
    public function newCategory(Request $request, CsrfTokenManagerInterface $csrf_token)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("category_item"));
        }
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);
        $form->submit($request->request->all());
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $category = $form->getData();
            $em->persist($category);
            $em->flush();

            $response = new JSONResponse("The category has been created.", Response::HTTP_CREATED);
            return $response;
        }

        return new JsonResponse('Error while creating the new category.', Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/admin/dashboard/categories/edit/{id}", methods={"GET", "POST"}, name="edit_category")
     */
    public function editCategory(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("category_item"));
        }
        $category = $this->getDoctrine()->getRepository(Category::class)->find($id);

        if ($category) {
            $form = $this->createForm(CategoryType::class, $category);
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $category = $form->getData();
                $em->persist($category);
                $em->flush();

                $response = new JSONResponse("The category has been edited.", Response::HTTP_OK);
                return $response;
            }
        }
        return new JsonResponse('Error while saving the edited category.', Response::HTTP_EXPECTATION_FAILED);
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
            return new JsonResponse('The category has been deleted.', Response::HTTP_ACCEPTED);
        }


        return new JsonResponse('Error while deleting the category.', Response::HTTP_EXPECTATION_FAILED);
    }
}
