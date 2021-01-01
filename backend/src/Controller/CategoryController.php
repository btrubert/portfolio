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
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Doctrine\DBAL\Exception\ConnectionException;

/**
 * @Route("/smf")
 */
class CategoryController extends AbstractController
{

    /**
     * @Route("/categories", name="api_categories")
     */
    public function categories(ObjectEncoder $objectEncoder)
    {
        try {
            $categories = $this->getDoctrine()->getRepository(Category::class)->findPublic();
            $scategories = $objectEncoder->encodeObjectToJson($categories, ['id', 'user']);

            return new JsonResponse(json_decode($scategories));
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/profile/categories/", name="profile_categories")
     */
    public function profileCategory(ObjectEncoder $objectEncoder)
    {
        try {
            $user = $this->getUser();
            $category = $this->getDoctrine()->getRepository(Category::class)->findOneBy(['user' => $user->getId()]);
            if ($category) {
                if ($this->isGranted("access", $category)) {
                    $scategory = $objectEncoder->encodeObjectToJson($category, ['id']);
                    return new JsonResponse(json_decode($scategory));
                } else {
                    return new JsonResponse("Access denied.", Response::HTTP_UNAUTHORIZED);
                }
            } else {
                return new JsonResponse("No private categories available.", Response::HTTP_NOT_FOUND);
            }
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/categories", name="categories_list")
     */
    public function listCategories(ObjectEncoder $objectEncoder)
    {
        try {
            $categories = $this->getDoctrine()->getRepository(Category::class)->findAll();
            $scategories = $objectEncoder->encodeObjectToJson($categories);
            return new JsonResponse(json_decode($scategories));
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/category/new", methods={"GET", "POST"}, name="new_category")
     */
    public function newCategory(Request $request, CsrfTokenManagerInterface $csrf_token)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("category_item"));
            }
            $category = new Category();
            $form = $this->createForm(CategoryType::class, $category);
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $category = $form->getData();
                $category->setBlog(false);
                $em->persist($category);
                $em->flush();

                return new JSONResponse("The category has been created.", Response::HTTP_CREATED);
            }

            return new JsonResponse("Incorrect form data.", Response::HTTP_NOT_ACCEPTABLE);
        } catch (ConnectionException $e) {
            return new JsonResponse("Error while creating the new category.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/category/edit/{id}", methods={"GET", "POST"}, name="edit_category")
     */
    public function editCategory(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("category_item"));
            }
            $category = $this->getDoctrine()->getRepository(Category::class)->find($id);

            if ($category) {
                $public = $category->getPublic();
                $form = $this->createForm(CategoryType::class, $category);
                $form->submit($request->request->all());
                if ($form->isSubmitted() && $form->isValid()) {
                    $em = $this->getDoctrine()->getManager();
                    $category = $form->getData();
                    if ($public != $category->getPublic()) {
                        $category->changeVisibility($this->getParameter("img_base_dir"), $this->getParameter("img_prot_base_dir"));
                    }
                    $em->persist($category);
                    $em->flush();

                    return new JSONResponse("The category has been edited.", Response::HTTP_OK);
                }
                return new JsonResponse("Incorrect form data.", Response::HTTP_NOT_ACCEPTABLE);
            }
            return new JsonResponse("Can't find the edited category.", Response::HTTP_NOT_FOUND);
        } catch (ConnectionException $e) {
            return new JsonResponse("Error while creating the new category.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/category/delete/{id}", methods={"GET", "POST"}, name="delete_category")
     */
    public function deleteCategory(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("delete_category_" . $id));
            }

            $submittedToken = $request->request->get('_token');
            if ($this->isCsrfTokenValid("delete_category_" . $id, $submittedToken)) {

                $category = $this->getDoctrine()->getRepository(Category::class)->find($id);
                if ($category) {
                    $em = $this->getDoctrine()->getManager();
                    $em->remove($category);
                    $em->flush();
                    return new JsonResponse('The category has been deleted.', Response::HTTP_ACCEPTED);
                } else {
                    return new JsonResponse('Category not found.', Response::HTTP_NOT_FOUND);
                }
            }
            return new JsonResponse('Error while deleting the category.', Response::HTTP_EXPECTATION_FAILED);
        } catch (ConnectionException $e) {
            return new JsonResponse("Error while creating the new category.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
