<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CategoryRepository::class)
 */
class Category
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="boolean")
     */
    private $public = false;

    /**
     * @ORM\OneToMany(targetEntity=Photo::class, mappedBy="category")
     */
    private $photos;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="categories")
     */
    private $user;

    /**
     * @ORM\Column(type="boolean")
     */
    private $blog;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPublic(): ?bool
    {
        return $this->public;
    }

    public function setPublic(bool $public): self
    {
        $this->public = $public;

        return $this;
    }

    /**
     * @return Collection|Photo[]
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(Photo $photo): self
    {
        if (!$this->photos->contains($photo)) {
            $this->photos[] = $photo;
            $photo->setCategory($this);
        }

        return $this;
    }

    public function removePhoto(Photo $photo): self
    {
        if ($this->photos->contains($photo)) {
            $this->photos->removeElement($photo);
            // set the owning side to null (unless already changed)
            if ($photo->getCategory() === $this) {
                $photo->setCategory(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getBlog(): ?bool
    {
        return $this->blog;
    }

    public function setBlog(bool $blog): self
    {
        $this->blog = $blog;

        return $this;
    }

    public function changeVisibility($publicDir, $protectedDir): self
    {
        [$origin, $destination] = $this->getPublic() ? [$protectedDir, $publicDir]
                            : [$publicDir, $protectedDir];
        foreach ($this->getPhotos() as $photo) {
            $path = $photo->getOriginalPath();
            if ($path) {
                rename($origin . $path, $destination . $path);
            }
            $path = $photo->getPath();
            rename($origin . $path, $destination . $path);
        }
        return $this;
    }
}
