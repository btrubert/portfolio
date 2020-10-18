<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Security;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="login")
     */
    public function currentUser(Security $security): Response
    {
        $curentUser = $security->getUser();
        $username = null;
        if (isset($curentUser)) {
            $username = $curentUser->getUsername();
        }

        return new JsonResponse(["currentUser"=>$username]);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        return $this->redirectToRoute('index');
    }
}
