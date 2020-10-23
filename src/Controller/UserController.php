<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use App\Service\ObjectEncoder;
use App\Entity\User;

class UserController extends AbstractController
{

    /**
     * @Route("/profile", name="user_profile")
     */
    public function profile()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/admin/dashboard", name="dashboard")
     */
    public function dashboard()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/admin/dashboard/users", name="users_list")
     */
    public function listCategories(ObjectEncoder $objectEncoder)
    {
        $users = $this->getDoctrine()->getRepository(User::class)->findAll();
        $susers = $objectEncoder->encodeObjectToJson($users);
        return new JsonResponse(json_decode($susers));
    }

    /**
     * @Route("/api/profile_info", name="profile_info")
     */
    public function profile_info(Security $security): Response
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

        return new JsonResponse(['user' => $user, 'admin' => $isAdmin]);
    }
}
