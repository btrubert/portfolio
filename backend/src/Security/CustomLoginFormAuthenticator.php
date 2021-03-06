<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\PassportInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\PasswordUpgradeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Psr\Log\LoggerInterface;

class CustomLoginFormAuthenticator extends AbstractAuthenticator
{
    public const LOGIN_ROUTE = 'login';

    private $entityManager;
    private $userRepository;
    private $logger;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->logger = $logger;
    }

    /**
     * Called on every request to decide if this authenticator should be
     * used for the request. Returning `false` will cause this authenticator
     * to be skipped.
     */
    public function supports(Request $request): ?bool
    {
        return self::LOGIN_ROUTE === $request->attributes->get('_route')
            && $request->isMethod('POST');
    }

    public function authenticate(Request $request): PassportInterface
    {
        $password = $request->request->get('password');
        $username = $request->request->get('username');
        $csrfToken = $request->request->get('_csrf_token');
        if (null === $username || null === $password || null === $csrfToken) {
            throw new CustomUserMessageAuthenticationException('Missing credentials');
        }

        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy(['username' => $username]);
        if (null === $user) {
            throw new UsernameNotFoundException();
        }

        return new Passport($user, new PasswordCredentials($password), [
            new PasswordUpgradeBadge($password, $this->userRepository),
            new RememberMeBadge(),
            new CsrfTokenBadge('authenticate', $csrfToken),
        ]);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // on success, let the request continue
        $username = $request->request->get('username');
        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy(['username' => $username]);
        if (in_array("ROLE_ADMIN", $user->getRoles())) {
            return new JsonResponse("/admin/dashboard", Response::HTTP_ACCEPTED);
        } else {
            return new JsonResponse("/profile", Response::HTTP_ACCEPTED);
        }
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            // you may want to customize or obfuscate the message first
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }
}
