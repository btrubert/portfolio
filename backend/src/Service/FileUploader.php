<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Exception;
use Psr\Log\LoggerInterface;

class FileUploader
{

    public function __construct($targetDirectory, $targetProtectedDirectory, LoggerInterface $logger)
    {
        $this->targetDirectory = $targetDirectory;
        $this->targetProtectedDirectory = $targetProtectedDirectory;
        $this->logger = $logger;
    }

    public function upload(UploadedFile $file, $quality, $protected, $original=true)
    {
        try {
            if (!in_array($file->guessExtension(), ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"])) {
                throw new Exception("Only Jpeg and PNG are supported.");
            }
            $directory = $protected? $this->targetProtectedDirectory : $this->targetDirectory;
            $fileName = uniqid("IMG_", true);
            $originalFilename =  'original/' . $fileName . '.' . $file->guessExtension();
            $file->move($directory . 'original/', $fileName . '.' . $file->guessExtension());
            $exifs = $this->extractExifs($directory . $originalFilename);
            $lowerResFilename = $this->saveLowerRes($originalFilename, $fileName, $directory, $quality);
            if (!$original) {
                unlink(realpath($directory . $originalFilename));
                $originalFilename = "";
            }
            return [$originalFilename, $lowerResFilename, $exifs];
        } catch (Exception $e) {
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
        $directory = $this->targetProtectedDirectory;

        try {
            copy($file, $directory . $originalFilename);
            $exifs = $this->extractExifs($directory . $originalFilename);
            $lowerResFilename = $this->saveLowerRes($originalFilename, $fileName, $directory);
            return [$originalFilename, $lowerResFilename, $exifs];
        } catch (FileException $e) {
            $this->logger->critical('Caught exception while uploading a photo : ' .  $e->getMessage());
            return null;
        }
    }

    public function saveLowerRes($originalFilename, $fileName, $directory, $quality=100)
    {
        try {

            list($width, $height) = getimagesize($directory . $originalFilename);
            $ratio = $width / $height;
            $new_width = 1024 * $ratio;
            $new_height = 1024;

            // Open image
            $type = exif_imagetype($directory . $originalFilename);
            switch ($type) {
                case 2: // jpg
                    $image = imageCreateFromJpeg($directory . $originalFilename);
                    break;
                case 3: // png
                    $image = imageCreateFromPng($directory . $originalFilename);
                    break;
                default: // format not supported
                    return null;
            }

            // Resample
            $image_low = imagecreatetruecolor($new_width, $new_height);
            imagecopyresampled($image_low, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            imagepalettecopy($image, $image_low);
            imagedestroy($image);
            imagewebp($image_low, $directory . $fileName . '.webp', $quality);
            imagedestroy($image_low);
            return  $fileName . '.webp';
        } catch (Exception $e) {
            $this->logger->critical('Caught exception while saving the low res photo : ' .  $e->getMessage());
            return null;
        }
    }

    public function extractExifs($path): array
    {
        $values = exif_read_data($path);
        if (!$values) {
            $this->logger->critical('Error: Unable to read exif headers');
            return [];
        }

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
