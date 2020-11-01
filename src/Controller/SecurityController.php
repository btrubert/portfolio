<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Security;


class SecurityController extends AbstractController
{
    
    /**
     * @Route("/login", name="login")
     */
    public function login(Security $security)
    {
        $curentUser = $security->getUser();
        if (isset($curentUser)) {
            return new JsonResponse("Signed in.", Response::HTTP_ACCEPTED);
        }
        return $this->redirectToRoute('index');
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout(Request $request)
    {
        return $this->redirectToRoute('index');
    }
}
