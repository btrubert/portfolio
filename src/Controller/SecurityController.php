<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class SecurityController extends AbstractController
{
    /**
     * @Route("/signedin", name="signed_in")
     */
    public function currentUser(Security $security): Response
    {
        $serializer = $this->get('serializer');
        $curentUser = $security->getUser();
        $user = null;
        $isAdmin = false;
        if (isset($curentUser)) {
            $normalizer = new ObjectNormalizer();
            $encoder = new JsonEncoder();
            $serializer = new Serializer([$normalizer], [$encoder]);

            $isAdmin = in_array("ROLE_ADMIN", $curentUser->getRoles());
            $user = json_decode($serializer->serialize($curentUser, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['password', 'salt', 'roles']]));
        }

        return new JsonResponse(['user'=>$user, 'admin'=>$isAdmin]);
    }

    /**
     * @Route("/login", name="login")
     */
    public function login(Security $security)
    {
        $curentUser = $security->getUser();
        if (isset($curentUser)) {
            return new JsonResponse("Sign in", Response::HTTP_ACCEPTED);
        }
        return $this->redirectToRoute('index');
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        return $this->redirectToRoute('index');
    }
}
