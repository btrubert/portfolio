<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;

class DefaultController extends AbstractController
{
    /**
     * @Route("/{reactRouting}", name="index", defaults={"reactRouting": null})
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/gallery/{category}", name="gallery", defaults={"category": null})
     */
    public function gallery($category)
    {
        if (!$category || ($category && $this->getDoctrine()->getRepository(Category::class)->findFromName($category))) {
            return $this->render('default/index.html.twig');
        } else {
            return $this->redirectToRoute('gallery');
        }
    }

    /**
     * @Route("/blog/{post}", name="blog", defaults={"post": null})
     */
    public function blog($post)
    {
        if (!$post || ($post && $this->getDoctrine()->getRepository(Category::class)->findFromId($post))) {
            return $this->render('default/index.html.twig');
        } else {
            return $this->redirectToRoute('blog');
        }
    }
}