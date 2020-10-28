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
     * @Route("/admin/dashboard/users/new", methods={"POST"}, name="new_user")
     */
    public function newUser(Request $request, UserPasswordEncoderInterface $passwordEncoder)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user, array('csrf_protection' => false));
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

            $response = new JSONResponse("ok", Response::HTTP_CREATED);
            return $response;
        }

        return new JsonResponse('error', Response::HTTP_EXPECTATION_FAILED);
    }

        /**
     * @Route("/admin/dashboard/users/edit/{id}", methods={"POST"}, name="edit_user")
     */
    public function editUser(Request $request, UserPasswordEncoderInterface $passwordEncoder, $id)
    {
        $user = $this->getDoctrine()->getRepository(User::class)->find($id);

        if ($user) {
            $form = $this->createForm(UserType::class, $user, array('csrf_protection' => false));
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
    
                $response = new JSONResponse("ok", Response::HTTP_CREATED);
                return $response;
            }
        }

        return new JsonResponse('error', Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/admin/dashboard/users/delete/{id}", methods={"DELETE"}, name="delete_user")
     */
    public function deleteUser(Request $request, $id)
    {
        // $submittedToken = $request->request->get('token');

        // // 'delete-item' is the same value used in the template to generate the token
        // if ($this->isCsrfTokenValid('delete-item', $submittedToken)) {
        //     // ... do something, like deleting an object
        // }
        $user = $this->getDoctrine()->getRepository(User::class)->find($id);
        if ($user) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();
            return new JsonResponse('ok', Response::HTTP_ACCEPTED);
        }


        return new JsonResponse('error', Response::HTTP_EXPECTATION_FAILED);
    }

    /**
     * @Route("/api/profile_info", name="profile_info")
     */
    public function profileInfo(Security $security, ObjectEncoder $objectEncoder): Response
    {
        $serializer = $this->get('serializer');
        $curentUser = $security->getUser();
        $user = null;
        $isAdmin = false;
        if (isset($curentUser)) {
            $isAdmin = in_array("ROLE_ADMIN", $curentUser->getRoles());
            $user = json_decode($objectEncoder->encodeObjectToJson($curentUser, ['password', 'salt', 'roles', 'categories', 'id']));
        }

        return new JsonResponse(['user' => $user, 'admin' => $isAdmin]);
    }
}
