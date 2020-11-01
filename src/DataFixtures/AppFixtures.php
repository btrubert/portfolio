<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Category;
use App\Entity\Photo;
use App\Service\FileUploader;
use DirectoryIterator;
use Exception;

class AppFixtures extends Fixture
{
    public function __construct(FileUploader $fileUploader)
    {
        $this->fileUploader = $fileUploader;
    }

    public function load(ObjectManager $manager)
    {
        foreach (new DirectoryIterator('./collection') as $cat) {
            if (!$cat->isDot() && $cat->isDir()) {
                $category = new Category();
                $category->setName($cat);
                $category->setPublic(true);

                $manager->persist($category);

                foreach (new DirectoryIterator($cat->getPathname()) as $file) {
                    if ($file->isFile() && $file->getBasename()!='.gitignore') {
                        [$fileName, $exifs] = $this->fileUploader->addLocal($file->getPathname());
                        $photo = new Photo();
                        $photo->setTitle($file->getBasename());
                        $photo->setExifs($exifs);
                        $photo->setCategory($category);
                        $photo->getCategory()->addPhoto($photo);
                        $photo->setPath($fileName);


                        $manager->persist($photo);
                        $manager->flush();
                    }
                }
            }
        }        
    }
}
