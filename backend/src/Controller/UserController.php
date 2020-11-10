<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use App\Service\ObjectEncoder;
use App\Entity\User;
use App\Form\UserType;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;


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
        $susers = $objectEncoder->encodeObjectToJson($users,  ['password', 'salt', 'roles', 'categories']);
        return new JsonResponse(json_decode($susers));
    }

    /**
     * @Route("/admin/dashboard/users/new", methods={"GET", "POST"}, name="new_user")
     */
    public function newUser(Request $request, UserPasswordEncoderInterface $passwordEncoder, CsrfTokenManagerInterface $csrf_token)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("user_item"));
        }

        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->submit($request->request->all());
        if ($form->isSubmitted() && $form->isValid() && $request->request->has("password")) {
            $em = $this->getDoctrine()->getManager();
            $user = $form->getData();
            if ($request->request->get("admin")) {
                $user->setRoles(["ROLE_ADMIN"]);
            }
            $user->setPassword($passwordEncoder->encodePassword($user, $request->request->get("password")));
            $em->persist($user);
            $em->flush();

            $response = new JSONResponse("The user has been created.", Response::HTTP_CREATED);
            return $response;
        }

        return new JsonResponse('Error while creating a new user.', Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/admin/dashboard/users/edit/{id}", methods={"GET", "POST"}, name="edit_user")
     */
    public function editUser(Request $request, UserPasswordEncoderInterface $passwordEncoder, CsrfTokenManagerInterface $csrf_token, $id)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("user_item"));
        }

        $user = $this->getDoctrine()->getRepository(User::class)->find($id);

        if ($user) {
            $form = $this->createForm(UserType::class, $user);
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $user = $form->getData();
                if ($request->request->get("admin")) {
                    $user->setRoles(["ROLE_ADMIN"]);
                } else {
                    $user->setRoles([]);
                }
                if ($request->request->has("password")) {
                    $user->setPassword($passwordEncoder->encodePassword($user, $request->request->get("password")));
                }
                $em->persist($user);
                $em->flush();

                $response = new JSONResponse("The user has been edited.", Response::HTTP_CREATED);
                return $response;
            }
        }

        return new JsonResponse("Error while editing the user.", Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/admin/dashboard/users/delete/{id}", methods={"GET", "POST"}, name="delete_user")
     */
    public function deleteUser(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        if ($request->isMethod("GET")) {
            return new Response($csrf_token->getToken("delete_user_" . $id));
        }

        $submittedToken = $request->request->get('_token');
        if ($this->isCsrfTokenValid("delete_user_" . $id, $submittedToken)) {
            $user = $this->getDoctrine()->getRepository(User::class)->find($id);
            if ($user) {
                $em = $this->getDoctrine()->getManager();
                $em->remove($user);
                $em->flush();
                return new JsonResponse('ok', Response::HTTP_ACCEPTED);
            }
        }

        return new JsonResponse("Error while deleting the user.", Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/api/profile_info", methods={"GET"}, name="profile_info")
     */
    public function profileInfo(Security $security, ObjectEncoder $objectEncoder, CsrfTokenManagerInterface $csrf_token): Response
    {
        $curentUser = $security->getUser();
        $user = null;
        $isAdmin = false;
        $token = "";
        if (isset($curentUser)) {
            $isAdmin = in_array("ROLE_ADMIN", $curentUser->getRoles());
            $user = json_decode($objectEncoder->encodeObjectToJson($curentUser, ['password', 'salt', 'roles', 'categories', 'id']));
            $token = $csrf_token->getToken("logout")->getValue();
        } else {
            $token = $csrf_token->getToken("authenticate")->getValue();
        }

        return new JsonResponse(['user' => $user, 'admin' => $isAdmin, 'token' => $token]);
    }
}
