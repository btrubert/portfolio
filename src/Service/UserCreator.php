<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;
use App\Repository\UserRepository;

class UserCreator
{

    private $passwordEncoder;
    private $userRepository;
    private $entityManager;

     public function __construct(UserPasswordEncoderInterface $passwordEncoder, UserRepository $userRepository, EntityManagerInterface $entityManager)
     {
         $this->passwordEncoder = $passwordEncoder;
         $this->userRepository = $userRepository;
         $this->entityManager = $entityManager;
     }

    public function createUser($username, $firstName, $lastName, $password, $email, $admin): bool
    {
        $admin = $this->userRepository->findOneBy(["username" => $username]);
        if ($admin) {
             return false;
        } else {
            $admin = new User();
            $admin->setFirstName($firstName)->setLastName($lastName)->setUsername($username);
            $admin->setEmail($email);
            $admin->setRoles($admin? ["ROLE_ADMIN"]: []);
            $admin->setPassword($this->passwordEncoder->encodePassword($admin, $password));
            $this->entityManager->persist($admin);


            $this->entityManager->flush();

            return true;
        }
    }
}
