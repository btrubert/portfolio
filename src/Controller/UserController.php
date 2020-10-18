<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;

class UserController extends AbstractController
{
    /**
     * @Route("/api/profile_info)", name="profile_info")
     */
    public function profileInfo(Security $security)
    {
        $curentUser = $security->getUser();
        return new JsonResponse($curentUser);
    }
    
}
