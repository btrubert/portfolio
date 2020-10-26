CREATE DATABASE IF NOT EXISTS portfolio;
CREATE TABLE IF NOT EXISTS `rememberme_token` (`series` char(88) UNIQUE PRIMARY KEY NOT NULL, `value` varchar(88)  NOT NULL,`lastUsed` datetime  NOT NULL, `class` varchar(100) NOT NULL, `username` varchar(200) NOT NULL);
INSERT IGNORE INTO `user` (`username`, `roles`, `password`, `email`, `first_name`, `last_name`) VALUES ('admin', '["ROLE_ADMIN"]', '$argon2id$v=19$m=65536,t=4,p=1$ZlhiRzRva2ZlVGxBRmI1bQ$YFKvLxxgn3Z2VJQdBqwsiqlD2kxNoqwdzilskls0aTg', 'admin@localhost', 'Ad', 'Min');
mysql -u ben -h 172.17.0.1 -p