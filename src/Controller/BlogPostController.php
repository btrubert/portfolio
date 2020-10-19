<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\BlogPost;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use App\Form\BlogPostType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;


class BlogPostController extends AbstractController
{

    /**
     * @Route("/blog/{post}", name="blog", defaults={"post": null})
     */
    public function blog($post)
    {
        if (!$post || ($post && $this->getDoctrine()->getRepository(Category::class)->findFromId($post))) {
            return $this->render('default/index.html.twig');
        } else {
            return $this->redirectToRoute('blog');
        }
    }


    /**
     * @Route("/new", name="new_post")
     */
    public function new(Request $request)
    {
        $blogPost = new BlogPost();
        $blogPost->setTitle('Write a blog post');
        $blogPost->setContent("LoremIpsum");

        $form = $this->createForm(BlogPostType::class, $blogPost);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$task` variable has also been updated
            $blogPost = $form->getData();

            $this->_createPost($blogPost);

            return $this->redirectToRoute('list_post');
        }

        return $this->render('category/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/edit/{id}", name="edit_post")
     */
    public function edit(Request $request, $id)
    {
        $blogPost = $this->_getPost($id);

        $form = $this->createForm(BlogPostType::class, $blogPost);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$task` variable has also been updated
            $newPost = $form->getData();
            $this->_updatePost($id, $newPost);

            return $this->redirectToRoute('list_post');
        }

        return $this->render('blog_post/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/delete/{id}", name="delete_post")
     */
    public function delete($id)
    {
        $this->_deletePost($id);
        return $this->redirectToRoute('list_post');
    }

    public function _createPost($post): BlogPost
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();

            //Commit the new entry to the DB
            $entityManager->persist($post);
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while creating a new blog post : ',  $e->getMessage(), "\n";
            return null;
        }
        return $post;
    }

    public function _updatePost($id, $newPost): bool
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
            $blogPost->setAuthor($newPost->getAuthor());
            //Update the title field of the post
            $blogPost->setTitle($newPost->getTitle());
            //Update the content field of the post
            $blogPost->setContent($newPost->getContent());

            //Commit the updated entry to the DB
            $entityManager->flush();
        } catch (Exception $e) {
            echo 'Caught exception while updating a post : ',  $e->getMessage(), "\n";
            return false;
        }
        return true;
    }

    public function _deletePost($id): bool
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);

            if (!$blogPost) {
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

    public function _getPost($id): BlogPost
    {
        try {
            //Get the DB manager
            $entityManager = $this->getDoctrine()->getManager();
            //Retrieve the blog post
            $blogPost = $entityManager->getRepository(BlogPost::class)->find($id);
        } catch (Exception $e) {
            echo 'Caught exception while fetching a post : ',  $e->getMessage(), "\n";
            return null;
        }
        return $blogPost;
    }

    public function _getListPosts($offset = 0, $limit = 0): array
    {
        try {
            $listPosts = $this->getDoctrine()->getRepository(BlogPost::class)->findManyFromOffset($offset, $limit);
        } catch (Exception $e) {
            echo 'Caught exception while fetching a list of posts : ',  $e->getMessage(), "\n";
            return null;
        }
        return $listPosts;
    }
}
