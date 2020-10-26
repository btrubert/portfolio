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
        $fileName = uniqid("IMG_", true).'.'.$file->guessExtension();

        try {
            $file->move($this->getTargetDirectory(), $fileName);
            $exifs = $this->_extractExifs($this->getTargetDirectory().$fileName);
            $this->_saveLowerRes($fileName);
        } catch (FileException $e) {
            $this->logger->critical('Caught exception while uploading a photo : ' .  $e->getMessage());
            return "";
        }

        return [$fileName, $exifs];
    }

    /**
     * Add local photos from AppFixtures
     */
    public function addLocal($file)
    {
        $fileName = uniqid("IMG_", true).'.jpg';
        try {
            copy($file, $this->getTargetDirectory().$fileName);
            $exifs = $this->_extractExifs($this->getTargetDirectory().$fileName);
            $this->_saveLowerRes($fileName);
        } catch (FileException $e) {
            $this->logger->critical('Caught exception while uploading a photo : ' .  $e->getMessage());
            return ["",[]];
        }

        return [$fileName, $exifs];
    }

    public function getTargetDirectory()
    {
        return $this->targetDirectory;
    }

    public function _saveLowerRes($fileName)
    {
        try {
            list($width, $height) = getimagesize($this->getTargetDirectory().$fileName);
            $ratio = $width / $height;
            $new_width = 1024 * $ratio;
            $new_height = 1024;

            // Resample
            $image_low = imagecreatetruecolor($new_width, $new_height);
            $image = imagecreatefromjpeg($this->getTargetDirectory().$fileName);
            imagecopyresampled($image_low, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

            imagejpeg($image_low, $this->getTargetDirectory().'img/'.$fileName);
        } catch (Exception $e) {
            $this->logger->critical('Caught exception while saving the low res photo : ' .  $e->getMessage());
            return false;
        }
        return true;
    }

    public function _extractExifs($path): array
    {
        // Attempt to read the exif headers
        $values = exif_read_data($path);


        if (!$values) {
            $this->logger->critical('Error: Unable to read exif headers');
            return [];
        }

        $exifs = [];

        $exifs['shutter'] = isset($values['ExposureTime']) ? $this->_getFloatValue($values['ExposureTime']) . 's' : "n/a";
        $exifs['aperture'] = isset($values['FNumber']) ? 'f/' . $this->_getFloatValue($values['FNumber']) : "n/a";
        $exifs['iso'] = isset($values['ISOSpeedRatings']) ? $values['ISOSpeedRatings'] . ' iso' : 'n/a';
        $exifs['focal'] = isset($values['FocalLength']) ? $this->_getFloatValue($values['FocalLength']) . 'mm' : "n/a";
        $exifs['brand'] = isset($values['Make']) ? $values['Make'] : 'n/a';
        $exifs['model'] = isset($values['Model']) ? $values['Model'] : 'n/a';
        $exifs['date'] = isset($values['DateTimeOriginal']) ? $values['DateTimeOriginal'] : 'n/a';

        return $exifs;
    }

    public function _getFloatValue($s): string
    {
        if (!strpos($s, '/')) {
            return $s;
        } else {
            $numbers = explode("/", $s);

            return $numbers[0] < $numbers[1] ? '1/' . $numbers[1] / $numbers[0] : '' . $numbers[0] / $numbers[1];
        }
    }
}