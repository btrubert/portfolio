<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;


class UserFixtures extends Fixture
{
    private $passwordEncoder;

     public function __construct(UserPasswordEncoderInterface $passwordEncoder)
     {
         $this->passwordEncoder = $passwordEncoder;
     }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setFirstName("Benjamin")->setLastName("Trubert")->setUsername("btrubert");
        $user->setEmail("benjamin.trubert@gmail.com");
        $user->setRoles(["ROLE_USER"]);
        $user->setPassword($this->passwordEncoder->encodePassword($user, 'password'));
        $manager->persist($user);

        $user = new User();
        $user->setFirstName("Benjamin")->setLastName("Trubert")->setUsername("benj");
        $user->setEmail("benjamin.trubert@gmail.com");
        $user->setRoles(["ROLE_USER"]);
        $user->setPassword($this->passwordEncoder->encodePassword($user, 'password'));
        $manager->persist($user);

        $admin = new User();
        $admin->setFirstName("Ad")->setLastName("Min")->setUsername("admin");
        $admin->setEmail("admin@localhost");
        $admin->setRoles(["ROLE_ADMIN"]);
        $admin->setPassword($this->passwordEncoder->encodePassword($admin, 'admin'));
        $manager->persist($admin);


        $manager->flush();

    }
}
