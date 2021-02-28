<?php

namespace App\Entity;

use App\Repository\PhotoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
/**
 * @ORM\Entity(repositoryClass=PhotoRepository::class)
 */
class Photo
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
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $path;

    /**
     * @ORM\Column(type="json")
     */
    private $exifs = [];

    /**
     * @ORM\ManyToOne(targetEntity=Category::class, inversedBy="photos")
     */
    private $category;

    /**
     * @ORM\Column(type="boolean")
     */
    private $download = false;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $original_path;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getExifs(): ?array
    {
        return $this->exifs;
    }

    public function setExifs(array $exifs): self
    {
        $this->exifs = $exifs;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function isPrivate(): bool
    {
        return  !$this->getCategory()->getPublic();
    }

    public function getDownload(): ?bool
    {
        return $this->download;
    }

    public function setDownload(bool $download): self
    {
        $this->download = $download;

        return $this;
    }

    public function getOriginalPath(): ?string
    {
        return $this->original_path;
    }

    public function setOriginalPath(string $original_path): self
    {
        $this->original_path = $original_path;

        return $this;
    }

    public function changeVisibility($publicDir, $protectedDir): self
    {
        [$origin, $destination] = $this->getCategory()->getPublic() ? [$protectedDir, $publicDir]
                            : [$publicDir, $protectedDir];
        $path = $this->getOriginalPath();
        if ($path) {
            rename($origin . $path, $destination . $path);
        }
        $path = $this->getPath();
        rename($origin . $path, $destination . $path);
        return $this;
    }
}
