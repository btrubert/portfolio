<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\BlogPost;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class BlogPostController extends AbstractController
{
    /**
     * @Route("/blog/post", name="blog_post")
     */
    public function index()
    {
        return $this->render(
            'blog_post/index.html.twig',
            [
                'controller_name' => 'BlogPostController',
            ]
        );
    }

    /**
     * @Route("/blog/post/new", name="new_blog_post")
     */
    public function createPost()
    {
        $params = [];
        $blogPost = $this->_createPost($params);

        return new Response('Saved new product with id ' . $blogPost->getId());
    }

    private function _createPost($post): BlogPost
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            //Insert the field of the new post
            $blogPost = new BlogPost();
            $blogPost->setAuthor($post['name']);
            $blogPost->setTitle($post['title']);
            $blogPost->setContent($post['content']);

            //Commit the new entry to the DB
            $entityManager->persist($blogPost);
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while creating a new blog post : ',  $e->getMessage(), "\n";
            return null;
        }
        return $blogPost;
    }

    private function _updateAuthor($id, $authorName): bool
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);

            if (!$blogPost) //if the blog post could not be retrieved
            {
                return false;
            }

            //Update the author field of the post
            $blogPost->setAuthor($authorName);

            //Commit the updated entry to the DB
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while updating the author name : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    private function _updateTitle($id, $title): bool
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);

            if (!$blogPost) //if the blog post could not be retrieved
            {
                return false;
            }

            //Update the title field of the post
            $blogPost->setTitle($title);

            //Commit the updated entry to the DB
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while updating the title : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    private function _updateContent($id, $content): bool
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);

            if (!$blogPost) //if the blog post could not be retrieved
            {
                return false;
            }

            //Update the content field of the  post
            $blogPost->setContent($content);

            //Commit the updated entry to the DB
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while updating the content : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    private function _deletePost($id): bool
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);

            if (!$blogPost) //if the blog post could not be retrieved
            {
                return false;
            }

            //Delete the blog post
            $entityManager->remove($blogPost);

            //Commit the updated entry to the DB
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while updating the content : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    private function _getPost($id): BlogPost
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);
        } catch (Exception $e) {
            echo 'Caught exception while updating the content : ',  $e->getMessage(), "\n";
            return null;
        }
        return $blogPost;
    }

    private function _getListPosts($offset, $limit): array
    {
        try {
            $listPosts = $this->getDoctrine()->getRepository()->findManyFromOffset($offset, $limit);
        } catch (Exception $e) {
            echo 'Caught exception while updating the content : ',  $e->getMessage(), "\n";
            return null;
        }
        return $listPosts;
    }
}
