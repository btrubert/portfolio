<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Photo;
use Exception;
use App\Form\PhotoType;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Category;
use App\Service\FileUploader;
use App\Service\ObjectEncoder;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Doctrine\DBAL\Exception\ConnectionException;

/**
 * @Route("/smf")
 */
class PhotoController extends AbstractController
{


    /**
     * @Route("/gallery/{catName}", name="api_photos")
     */
    public function photos($catName, ObjectEncoder $objectEncoder)
    {
        try {
            $category = $this->getDoctrine()->getRepository(Category::class)->findFromName($catName);
            if ($category && ($category->getPublic() || $this->isGranted("access", $category))) {
                $photos = $category->getPhotos();

                $sphotos = $objectEncoder->encodeObjectToJson($photos, ['originalPath', 'id', 'created_at']);
                return new JsonResponse(json_decode($sphotos));
            } else {
                return new JsonResponse("This category does not exit.", Response::HTTP_NOT_FOUND);
            }
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



    /**
     * @Route("/img/{path}", name="show_img")
     */
    public function show($path)
    {
        try {
            $photo = $this->getDoctrine()->getRepository(Photo::class)->findOneBy(["path" => $path]);

            if (null === $photo) {
                return new Response("File not found.", Response::HTTP_NOT_FOUND);
            }

            if ($photo->getCategory()->getPublic() || $this->isGranted('view', $photo)) {
                $response = new Response();
                $base_dir = $photo->getCategory()->getPublic() ? $this->getParameter("img_base_dir") : $this->getParameter("img_prot_base_dir");
                $path = $base_dir . $photo->getPath();
                $response->headers->set("Content-type", mime_content_type($path));
                $response->headers->set("Content-Length", filesize($path));
                $response->setContent(readfile($path));
                $response->setStatusCode(Response::HTTP_OK);
                return $response;
            }
            return new Response("You must log in to access this pictures.", Response::HTTP_FORBIDDEN);
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/photos", name="photos_list")
     */
    public function listPhotos(ObjectEncoder $objectEncoder)
    {
        try {
            $photos = $this->getDoctrine()->getRepository(Photo::class)->findAll();
            $sphotos = $objectEncoder->encodeObjectToJson($photos);
            return new JsonResponse(json_decode($sphotos));
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/photo/new", methods={"GET", "POST"}, name="new_photo")
     */
    public function newPhoto(Request $request, FileUploader $fileUploader,  CsrfTokenManagerInterface $csrf_token)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("photo_item"));
            }

            $photo = new Photo();
            $form = $this->createForm(PhotoType::class, $photo);
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $photo = $form->getData();

                $file = $request->files->get("path");
                $quality = $request->request->get("quality");
                $original = $request->request->get("original");
                $protected = !$photo->getCategory()->getPublic();
                $savedFile = $fileUploader->upload($file, $quality, $protected, $original);
                if ($savedFile) {
                    [$originalFilename, $photoFileName, $exifs] = $savedFile;
                    $photo->setPath($photoFileName);
                    $photo->setOriginalPath($originalFilename);
                    $photo->setExifs($exifs);
                    $em->persist($photo);
                    $em->flush();
                    $response = new JsonResponse("The photo has been created.", Response::HTTP_CREATED);
                } else {
                    $response = new JsonResponse("The picture has not been saved", Response::HTTP_FORBIDDEN);
                }
                return $response;
            }
            return new JsonResponse("Incorrect form data.", Response::HTTP_NOT_ACCEPTABLE);
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @Route("/admin/photo/edit/{id}", methods={"GET", "POST"}, name="edit_photo")
     */
    public function editPhoto(Request $request, FileUploader $fileUploader, CsrfTokenManagerInterface $csrf_token, $id)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("photo_item"));
            }

            $photo =  $this->getDoctrine()->getRepository(Photo::class)->find($id);
            if ($photo) {
                $form = $this->createForm(PhotoType::class, $photo);
                $form->submit($request->request->all());
                if ($form->isSubmitted() && $form->isValid()) {
                    $em = $this->getDoctrine()->getManager();
                    $path = $photo->getOriginalPath();
                    if ($request->request->has("quality") && $path) {
                        $quality = $request->request->get("quality");
                        $path = $photo->getOriginalPath();
                        $directory =  $photo->getCategory()->getPublic() ? $this->getParameter("img_base_dir") : $this->getParameter("img_prot_base_dir");
                        $fileUploader->saveLowerRes($path, pathinfo($path)['filename'], $directory, $quality);
                    }
                    $original = $request->request->get("original");
                    if (!$original && $path) {
                        if ($this->deleteFile($photo, true)) {
                            $photo->setOriginalPath("");
                        }
                    }
                    $photo = $form->getData();
                    $em->persist($photo);
                    $em->flush();

                    $response = new JSONResponse("The photo has been edited.", Response::HTTP_OK);
                    return $response;
                }
                return new JsonResponse("Incorrect form data.", Response::HTTP_NOT_ACCEPTABLE);
            }
            return new JsonResponse('Error while saving the edited photo', Response::HTTP_NOT_FOUND);
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/photo/delete/{id}", methods={"GET", "POST"}, name="delete_photo")
     */
    public function deletePhoto(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("delete_photo_" . $id));
            }

            $submittedToken = $request->request->get('_token');
            if ($this->isCsrfTokenValid('delete_photo_' . $id, $submittedToken)) {
                $photo = $this->getDoctrine()->getRepository(Photo::class)->find($id);
                if ($photo) {
                    $em = $this->getDoctrine()->getManager();
                    if (!$this->deleteFile($photo)) {
                        throw new Exception("Error while deleting a file.");
                    }
                    $em->remove($photo);
                    $em->flush();
                    return new JsonResponse('The photo has been deleted.', Response::HTTP_ACCEPTED);
                } else {
                    return new JsonResponse('Category not found.', Response::HTTP_NOT_FOUND);
                }
            }

            return new JsonResponse('Error while deleting the photo.', Response::HTTP_EXPECTATION_FAILED);
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function deleteFile($photo, $onlyOriginal = false)
    {
        try {
            $base_dir = $photo->getCategory()->getPublic() ? $this->getParameter("img_base_dir") : $this->getParameter("img_prot_base_dir");
            if ($onlyOriginal) {
                $path = $base_dir . $photo->getOriginalPath();
                unlink(realpath($path));
                return true;
            } else {
                unlink(realpath($base_dir . $photo->getPath()));
                $path = $photo->getOriginalPath();
                if ($path) {
                    unlink(realpath($base_dir . $path));
                }
                return true;
            }
        } catch (Exception $e) {
            return false;
        }
    }
}
