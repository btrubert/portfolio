<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\BlogPost;
use App\Entity\Category;
use Exception;
use App\Form\BlogPostType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\ObjectEncoder;
use Doctrine\DBAL\Exception\ConnectionException;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use App\Controller\PhotoController;


/**
 * @Route("/smf")
 */
class BlogPostController extends AbstractController
{

    /**
     * @Route("/admin/posts", name="posts_list")
     */
    public function listPosts(ObjectEncoder $objectEncoder)
    {
        try {
            $posts = $this->getDoctrine()->getRepository(BlogPost::class)->findAll();
            $sposts = $objectEncoder->encodeObjectToJson($posts, ['category', 'updatedAt', 'content']);
            return new JsonResponse(json_decode($sposts));
        } catch (ConnectionException $e) {
            return new JsonResponse("Can't access the requested data.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable".$e, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/post/new", methods={"GET", "POST"}, name="new_post")
     */
    public function newPost(Request $request, CsrfTokenManagerInterface $csrf_token)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("post_item"));
            }
            $post = new BlogPost();
            $form = $this->createForm(BlogPostType::class, $post);
            $form->submit($request->request->all());
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $post = $form->getData();
                $post->setContent("---\nauthor: ".$post->getAuthor()."\ntitle: ".$post->getTitle()."\n---");
                $post->setPublished(false);

                $category = new Category();
                $category->setName("_blog_".$post->getTitle());
                $category->setPublic(false);
                $category->setBlog(true);
                $post->setCategory($category);

                $em->persist($post);
                $em->persist($category);
                $em->flush();

                $response = new JSONResponse("The post has been created.", Response::HTTP_CREATED);
                return $response;
            }

            return new JsonResponse("Incorrect form data.", Response::HTTP_NOT_ACCEPTABLE);
        } catch (ConnectionException $e) {
            return new JsonResponse("Error while creating the new post.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable".$e, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/admin/post/delete/{id}", methods={"GET", "POST"}, name="delete_post")
     */
    public function deletePost(Request $request, CsrfTokenManagerInterface $csrf_token, $id)
    {
        try {
            if ($request->isMethod("GET")) {
                return new Response($csrf_token->getToken("delete_post_" . $id));
            }

            $submittedToken = $request->request->get('_token');
            if ($this->isCsrfTokenValid("delete_post_" . $id, $submittedToken)) {

                $post = $this->getDoctrine()->getRepository(BlogPost::class)->find($id);
                if ($post) {
                    $em = $this->getDoctrine()->getManager();
                    $category = $post->getCategory();
                    if ($category) {
                        foreach ($category->getPhotos() as $photo) {
                            $base_dir = $photo->getCategory()->getPublic() ? $this->getParameter("img_base_dir") : $this->getParameter("img_prot_base_dir");
                            PhotoController::deleteFile($photo, $base_dir);
                            $em->remove($photo);
                        }
                        $em->remove($category);
                    }
                    $em->remove($post);
                    $em->flush();
                    return new JsonResponse('The post has been deleted.', Response::HTTP_ACCEPTED);
                } else {
                    return new JsonResponse('Category not found.', Response::HTTP_NOT_FOUND);
                }
            }
            return new JsonResponse('Error while deleting the category.', Response::HTTP_EXPECTATION_FAILED);
        } catch (ConnectionException $e) {
            return new JsonResponse("Error while creating the new category.", Response::HTTP_SERVICE_UNAVAILABLE);
        } catch (Exception $e) {
            return new JsonResponse("The server is currently unavailable", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
