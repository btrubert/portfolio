<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use App\Service\ObjectEncoder;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Doctrine\DBAL\Exception\ConnectionException;
use Exception;
use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route("/smf")
 */
class SecurityController extends AbstractController
{

    /**
     * @Route("/login", name="login")
     */
    public function login(Security $security, ObjectEncoder $objectEncoder)
    {
        // $curentUser = $security->getUser();
        // if (isset($curentUser)) {
        //     $user = json_decode($objectEncoder->encodeObjectToJson($curentUser, ['password', 'salt', 'roles', 'categories', 'id']));
        //     return new JsonResponse($user, Response::HTTP_ACCEPTED);
        // }
        // return new JsonResponse("Connection failed.", Response::HTTP_UNAUTHORIZED);
        return null;
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        return null;
    }

    /**
     * @Route("/profile_info", methods={"GET"}, name="profile_info")
     */
    public function profileInfo(Security $security, ObjectEncoder $objectEncoder, CsrfTokenManagerInterface $csrf_token): Response
    {
        try {
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
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/reset_password", methods={"POST"}, name="reset_password")
     */
    public function resetPassword(Request $request, UserPasswordEncoderInterface $passwordEncoder): Response
    {
        try {
            $submittedToken = $request->request->get('_csrf_token');
            if (!$this->isCsrfTokenValid("authenticate", $submittedToken)) {
                return new JsonResponse("Error while reseting the password.", Response::HTTP_EXPECTATION_FAILED);
            }
            $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['username' => $request->request->get("username")]);
            if (!$user) {
                return new JsonResponse("This user does not exist.", Response::HTTP_NOT_FOUND);
            }
            $password = substr(md5(uniqid()), 0, 8);
            $this->getDoctrine()->getRepository(User::class)->upgradePassword($user, $passwordEncoder->encodePassword($user, $password));
            return new JsonResponse(['password' => $password, 'email' => $user->getEmail()], Response::HTTP_ACCEPTED);
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
