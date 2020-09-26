<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;
use Exception;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Form\CategoryType;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/category")
 */
class CategoryController extends AbstractController
{
    /**
     * @Route("/list", name="categories")
     */
    public function index(SerializerInterface $serializer)
    {
        $categories = $this->_getCategories();
        return $this->render('category/index.html.twig', [
            'props' => $serializer->serialize($categories, 'json'),
        ]);
    }


    /**
     * @Route("/new", name="new_category")
     */
    public function newCategory(Request $request)
    {
        $category = new Category();
        $category->setName('new_category');
        $category->setPublic(false);

        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$task` variable has also been updated
            $category = $form->getData();

            $this->_createCategory($category);

            return $this->redirectToRoute('categories');
        }

        return $this->render('category/new.html.twig', [
            'form' => $form->createView(),
        ]);
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
