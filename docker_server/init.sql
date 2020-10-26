CREATE DATABASE IF NOT EXISTS portfolio;
CREATE TABLE IF NOT EXISTS `rememberme_token` (
	    `series`   char(88)     UNIQUE PRIMARY KEY NOT NULL,
	    `value`    varchar(88)  NOT NULL,
	    `lastUsed` datetime     NOT NULL,
	    `class`    varchar(100) NOT NULL,
	    `username` varchar(200) NOT NULL
);
INSERT IGNORE INTO `user` (`username`, `roles`, `password`, `email`, `first_name`, `last_name`) VALUES ('admin', 'ROLE_ADMIN', 'admin', 'admin@localhost', 'Ad', 'Min');
