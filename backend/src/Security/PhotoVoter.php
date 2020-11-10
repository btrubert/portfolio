<?php

namespace App\Security;

use App\Entity\Photo;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PhotoVoter extends Voter
{
    const VIEW = "view";
    const HIGH_RES = "high_res";

    protected function supports(string $attribute, $subject)
    {
        // if the attribute isn't one we support, return false
        if (!in_array($attribute, [self::VIEW, self::HIGH_RES])) {
            return false;
        }

        if (!$subject instanceof Photo) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            // the user must be logged in; if not, deny access
            return false;
        }

        // you know $subject is a Post object, thanks to `supports()`
        /** @var Photo $photo */
        $photo = $subject;

        switch ($attribute) {
                case self::VIEW:
                    return $this->canView($photo, $user);
                case self::HIGH_RES:
                    return $this->canHighRes($photo, $user);
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canView(Photo $photo, User $user)
    {
        return $user === $photo->getCategory()->getUser() || $user->isAdmin();
    }

    private function canHighRes(Photo $photo, User $user)
    {
        return $this->canView($photo, $user) && $photo->getDownload();
    }
}
