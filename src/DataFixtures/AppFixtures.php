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
            if (!$cat->isDot()) {
                $category = new Category();
                $category->setName($cat);
                $category->setPublic(true);

                $manager->persist($category);

                foreach (new DirectoryIterator($cat->getPathname()) as $file) {
                    if ($file->isFile()) {
                        $path = $this->_saveFile($file);
                        $photo = new Photo();
                        $photo->setTitle($file->getBasename());
                        $photo->setExifs($this->_extractExifs($file->getPathname()));
                        $photo->setCategory($category);
                        $photo->getCategory()->addPhoto($photo);
                        $photo->setPath($path);


                        $manager->persist($photo);
                    }
                }
            }
        }

        $manager->flush();
    }

    private function _saveFile($file)
    {
        $fileName = uniqid() . '.' . $file->getExtension();
        list($width, $height) = getimagesize($file->getPathname());
        try {
                $ratio = $width / $height;
                $new_width = 1080 * $ratio;
                $new_height = 1080;
        } catch (Exception $e) {
            echo 'Caught exception while adding a new photo : ', "\n", $file, ' ' . $width . 'x' . $height, "\n",  $e->getMessage(), "\n";
            return false;
        }

        // Resample
        $image_p = imagecreatetruecolor($new_width, $new_height);
        $image = imagecreatefromjpeg($file->getPathname());
        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

        imagejpeg($image_p, $this->fileUploader->getTargetDirectory() . $fileName);

        return $fileName;
    }

    private function _extractExifs($path): array
    {
        // Attempt to read the exif headers
        $values = exif_read_data($path);


        if (!$values) {
            echo 'Error: Unable to read exif headers';
            return [];
        }

        $exifs = [];

        $exifs['shutter'] = isset($values['ExposureTime']) ? $this->_getFloatValue($values['ExposureTime']) . 's' : "n/a";
        $exifs['aperture'] = isset($values['FNumber']) ? 'f/' . $this->_getFloatValue($values['FNumber']) : "n/a";
        $exifs['iso'] = isset($values['ISOSpeedRatings']) ? $values['ISOSpeedRatings'] : 'n/a';
        $exifs['focal'] = isset($values['FocalLength']) ? $this->_getFloatValue($values['FocalLength']) . 'mm' : "n/a";
        $exifs['brand'] = isset($values['Make']) ? $values['Make'] : 'n/a';
        $exifs['model'] = isset($values['Model']) ? $values['Model'] : 'n/a';
        $exifs['date'] = isset($values['DateTimeOriginal']) ? $values['DateTimeOriginal'] : 'n/a';

        return $exifs;
    }

    private function _getFloatValue($s): string
    {
        if (!strpos($s, '/')) {
            return $s;
        } else {
            $numbers = explode("/", $s);

            return $numbers[0] < $numbers[1] ? '1/' . $numbers[1] / $numbers[0] : '' . $numbers[0] / $numbers[1];
        }
    }
}
