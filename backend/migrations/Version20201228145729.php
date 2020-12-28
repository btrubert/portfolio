<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201228145729 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE blog_post (id INT AUTO_INCREMENT NOT NULL, category_id INT DEFAULT NULL, author VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, updated_content DATETIME DEFAULT NULL, published TINYINT(1) NOT NULL, locale VARCHAR(3) NOT NULL, description VARCHAR(255) DEFAULT NULL, cover VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_BA5AE01D2B36786B (title), INDEX IDX_BA5AE01D12469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, public TINYINT(1) NOT NULL, blog TINYINT(1) NOT NULL, INDEX IDX_64C19C1A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE photo (id INT AUTO_INCREMENT NOT NULL, category_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, path VARCHAR(255) NOT NULL, exifs LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', download TINYINT(1) NOT NULL, original_path VARCHAR(255) NOT NULL, INDEX IDX_14B7841812469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE blog_post ADD CONSTRAINT FK_BA5AE01D12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE photo ADD CONSTRAINT FK_14B7841812469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE TABLE `rememberme_token` (`series` char(88) UNIQUE PRIMARY KEY NOT NULL, `value` varchar(88)  NOT NULL,`lastUsed` datetime  NOT NULL, `class` varchar(100) NOT NULL, `username` varchar(200) NOT NULL)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE blog_post DROP FOREIGN KEY FK_BA5AE01D12469DE2');
        $this->addSql('ALTER TABLE photo DROP FOREIGN KEY FK_14B7841812469DE2');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1A76ED395');
        $this->addSql('DROP TABLE blog_post');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE photo');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE rememberme_token');
    }
}
