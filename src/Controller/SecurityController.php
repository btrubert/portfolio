<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Security;
use App\Service\ObjectEncoder;


class SecurityController extends AbstractController
{
    
    /**
     * @Route("/login", name="login")
     */
    public function login(Security $security, ObjectEncoder $objectEncoder)
    {
        $curentUser = $security->getUser();
        if (isset($curentUser)) {
            $user = json_decode($objectEncoder->encodeObjectToJson($curentUser, ['password', 'salt', 'roles', 'categories', 'id']));
            return new JsonResponse($user, Response::HTTP_ACCEPTED);
        }
        return new JsonResponse("Connection failed.", Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        return null;
    }
}
