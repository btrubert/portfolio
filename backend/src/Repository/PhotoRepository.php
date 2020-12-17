<?php

namespace App\Repository;

use App\Entity\Photo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Photo|null find($id, $lockMode = null, $lockVersion = null)
 * @method Photo|null findOneBy(array $criteria, array $orderBy = null)
 * @method Photo[]    findAll()
 * @method Photo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PhotoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Photo::class);
    }

    /**
     * @param $category name of th ecategory to fetch photos from
     * 
     * @return Photo[] Returns an array of Photo objects
     */
    public function findByCategoryName($catName)
    {
        return $this->createQueryBuilder('p')
            ->join('p.category', 'c', 'WITH', 'p.category=c.id')
            ->andWhere('c.name=:cat')
            ->setParameter('cat', $catName)
            ->getQuery()
            ->getResult();
    }
}
