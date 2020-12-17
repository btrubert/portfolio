<?php

namespace App\Repository;

use App\Entity\BlogPost;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BlogPost|null find($id, $lockMode = null, $lockVersion = null)
 * @method BlogPost|null findOneBy(array $criteria, array $orderBy = null)
 * @method BlogPost[]    findAll()
 * @method BlogPost[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BlogPostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BlogPost::class);
    }

    /**
     * @return BlogPost[] Returns an array of BlogPost objects
     */
    public function findPublished()
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.published = true')
            ->orderBy('b.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $offset id of the first item to fetch
     * @param $limit number of items to retrive
     * 
     * @return BlogPost[] Returns an array of BlogPost objects
     */
    public function findManyFromOffset($offset, $limit = 0): array
    {
        $q = $this->createQueryBuilder('b')
            ->setFirstResult($offset);
        if ($limit > 0) {
            $q->setMaxResults($limit);
        }
        $q->orderBy('b.updated_content', 'DESC');
        return $q->getQuery()->getResult();
    }
}
