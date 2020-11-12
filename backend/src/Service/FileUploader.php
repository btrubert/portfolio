<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Exception;
use Psr\Log\LoggerInterface;

class FileUploader
{

    public function __construct($targetDirectory, LoggerInterface $logger)
    {
        $this->targetDirectory = $targetDirectory;
        $this->logger = $logger;
    }

    public function upload(UploadedFile $file)
    {
        $fileName = uniqid("IMG_", true);
        $originalFilename =  'original/' . $fileName . '.' . $file->guessExtension();


        try {
            $file->move($this->getTargetDirectory() . $originalFilename);
            $exifs = $this->extractExifs($this->getTargetDirectory() . $originalFilename);
            $lowerResFilename = $this->saveLowerRes($originalFilename, $fileName);
            return [$originalFilename, $lowerResFilename, $exifs];
        } catch (FileException $e) {
            $this->logger->critical('Caught exception while uploading a photo : ' .  $e->getMessage());
            return null;
        }
    }

    /**
     * Add local photos from AppFixtures
     */
    public function addLocal($file)
    {
        $fileName = uniqid("IMG_", true);
        $originalFilename =  'original/' . $fileName . '.jpg';

        try {
            copy($file, $this->getTargetDirectory() . $originalFilename);
            $exifs = $this->extractExifs($this->getTargetDirectory() . $originalFilename);
            $lowerResFilename = $this->saveLowerRes($originalFilename, $fileName);
            return [$originalFilename, $lowerResFilename, $exifs];
        } catch (FileException $e) {
            $this->logger->critical('Caught exception while uploading a photo : ' .  $e->getMessage());
            return null;
        }
    }

    public function getTargetDirectory()
    {
        return $this->targetDirectory;
    }

    public function saveLowerRes($originalFilename, $fileName)
    {
        try {
            list($width, $height) = getimagesize($this->getTargetDirectory() . $originalFilename);
            $ratio = $width / $height;
            $new_width = 1024 * $ratio;
            $new_height = 1024;

            // Resample
            $image_low = imagecreatetruecolor($new_width, $new_height);
            $image = imagecreatefromjpeg($this->getTargetDirectory() . $originalFilename);
            imagecopyresampled($image_low, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            imagedestroy($image);
            imagewebp($image_low, $this->getTargetDirectory() . $fileName . '.webp', 100);
            imagedestroy($image_low);
        } catch (Exception $e) {
            //$this->logger->critical('Caught exception while saving the low res photo : ' .  $e->getMessage());
            return null;
        }
        return  $fileName . '.webp';
    }

    public function extractExifs($path): array
    {
        $values = exif_read_data($path);
        if (!$values) {
            $this->logger->critical('Error: Unable to read exif headers');
            return [];
        }

        $exifs = [];

        $exifs['shutter'] = isset($values['ExposureTime']) ? $this->getFloatValue($values['ExposureTime']) . 's' : "n/a";
        $exifs['aperture'] = isset($values['FNumber']) ? 'f/' . $this->getFloatValue($values['FNumber']) : "n/a";
        $exifs['iso'] = isset($values['ISOSpeedRatings']) ? $values['ISOSpeedRatings'] . ' iso' : 'n/a';
        $exifs['focal'] = isset($values['FocalLength']) ? $this->getFloatValue($values['FocalLength']) . 'mm' : "n/a";
        $exifs['brand'] = isset($values['Make']) ? $values['Make'] : 'n/a';
        $exifs['model'] = isset($values['Model']) ? $values['Model'] : 'n/a';
        $exifs['date'] = isset($values['DateTimeOriginal']) ? $values['DateTimeOriginal'] : 'n/a';

        return $exifs;
    }

    public function getFloatValue($s): string
    {
        if (!strpos($s, '/')) {
            return $s;
        } else {
            $numbers = explode("/", $s);

            return $numbers[0] < $numbers[1] ? '1/' . $numbers[1] / $numbers[0] : '' . $numbers[0] / $numbers[1];
        }
    }
}