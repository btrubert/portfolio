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
        $user->setPassword($this->passwordEncoder->encodePassword($user, 'password'));

        $manager->flush();
    }
}
