<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CategoryController extends AbstractController
{
    /**
     * @Route("/category", name="category")
     */
    public function index()
    {
        return $this->render('category/index.html.twig', [
            'controller_name' => 'CategoryController',
        ]);
    }

    private function _getCategories(): array
    {
        try {
            $q = $this->createQueryBuilder('c')
                ->where('public=true');

            $query = $q->getQuery();

            $categories = $query->execute();
        } catch (Exception $e) {
            echo 'Caught exception while getting the photos categories : ',  $e->getMessage(), "\n";
            return null;
        }
        return $categories;
    }
}
