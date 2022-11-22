# ************************************************************
# Sequel Ace SQL dump
# Version 20042
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 5.5.5-10.9.3-MariaDB-1:10.9.3+maria~ubu2204)
# Database: webcms
# Generation Time: 2022-11-22 21:40:42 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table dashboard_setting
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dashboard_setting`;

CREATE TABLE `dashboard_setting` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dashboard_setting_key` varchar(100) NOT NULL,
  `dashboard_setting_value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_dashboard_setting_uk` (`dashboard_setting_key`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table file
# ------------------------------------------------------------

DROP TABLE IF EXISTS `file`;

CREATE TABLE `file` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(200) NOT NULL,
  `file_title` varchar(255) DEFAULT '',
  `file_description` varchar(255) DEFAULT '',
  `file_mime_type` varchar(50) DEFAULT '',
  `file_size` varchar(100) DEFAULT '',
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fkc_file_user_id` (`user_id`),
  CONSTRAINT `fkc_file_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table language
# ------------------------------------------------------------

DROP TABLE IF EXISTS `language`;

CREATE TABLE `language` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `language_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_language_uk` (`language_name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;

INSERT INTO `language` (`created_at`, `updated_at`, `deleted_at`, `id`, `language_name`)
VALUES
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',1,'en'),
	('2021-10-14 06:42:48','2022-11-16 17:04:18','0000-00-00 00:00:00',2,'es');

/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table language_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `language_message`;

CREATE TABLE `language_message` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(10) unsigned NOT NULL,
  `language_message_key` varchar(200) NOT NULL,
  `language_message_value` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_language_message_uk` (`language_id`,`language_message_key`,`deleted_at`),
  CONSTRAINT `fkc_language_message_language_id` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `language_message` WRITE;
/*!40000 ALTER TABLE `language_message` DISABLE KEYS */;

INSERT INTO `language_message` (`created_at`, `updated_at`, `deleted_at`, `id`, `language_id`, `language_message_key`, `language_message_value`)
VALUES
	('2021-12-01 03:18:41','2022-11-16 17:04:18','0000-00-00 00:00:00',1,2,'files','archivos'),
	('2021-12-01 03:18:41','2022-11-16 17:04:18','0000-00-00 00:00:00',2,2,'dashboard','tablero'),
	('2021-12-09 02:44:22','2022-11-16 17:04:18','0000-00-00 00:00:00',3,2,'users','usuarios'),
	('2022-11-16 17:00:43','2022-11-16 17:04:19','0000-00-00 00:00:00',4,2,'documents','Oficios'),
	('2022-11-16 17:01:03','2022-11-16 17:04:19','0000-00-00 00:00:00',5,2,'new','nuevo'),
	('2022-11-16 17:01:43','2022-11-16 17:04:19','0000-00-00 00:00:00',6,2,'resources','recursos'),
	('2022-11-16 17:01:43','2022-11-16 17:04:19','0000-00-00 00:00:00',7,2,'sections','secciones'),
	('2022-11-16 17:02:52','2022-11-16 17:04:19','0000-00-00 00:00:00',9,2,'profile','perfil'),
	('2022-11-16 17:03:27','2022-11-16 17:04:19','0000-00-00 00:00:00',10,2,'Search','buscador');

/*!40000 ALTER TABLE `language_message` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notification`;

CREATE TABLE `notification` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `notification_title` varchar(150) NOT NULL,
  `notification_description` varchar(255) DEFAULT '',
  `notification_type` enum('log','error') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fkc_notification_user_id` (`user_id`),
  CONSTRAINT `fkc_notification_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `resource`;

CREATE TABLE `resource` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `resource_name` varchar(200) NOT NULL,
  `resource_description` varchar(255) DEFAULT '',
  `resource_type` enum('view','data') NOT NULL,
  `resource_path` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_resource_uk` (`resource_name`,`resource_type`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;

INSERT INTO `resource` (`created_at`, `updated_at`, `deleted_at`, `id`, `resource_name`, `resource_description`, `resource_type`, `resource_path`)
VALUES
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',1,'dashboard','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',2,'dashboard','','data','/dashboard/[0-9]*(/)*'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',3,'file','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',4,'files','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',5,'file','','data','/file/[0-9]*(/)*'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',7,'user','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',8,'users','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',9,'user','','data','/user/[0-9]*(/)*'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',11,'role','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',12,'roles','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',13,'role','','data','/role/[0-9]*(/)*'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',15,'resource','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',16,'resources','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',17,'resource','','data','/resource/[0-9]*(/)*'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',19,'search','','data','/search/?s=[dDw0-9a-zA-Z]+'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',21,'languages','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',22,'language','','view',''),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',24,'language','','data','/language/[0-9]*(/)*'),
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',25,'profile','','data','/profile/'),
	('2021-11-30 21:39:42','2021-11-30 21:39:42','0000-00-00 00:00:00',27,'notification','notification','data','/notification/[0-9]*(/)*');

/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(200) NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_role_uk` (`user_id`,`role_name`,`deleted_at`),
  CONSTRAINT `fkc_role_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`created_at`, `updated_at`, `deleted_at`, `id`, `role_name`, `user_id`)
VALUES
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',1,'administrator',1);

/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table role_resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role_resource`;

CREATE TABLE `role_resource` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(10) unsigned NOT NULL,
  `resource_id` int(10) unsigned NOT NULL,
  `permission` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_role_resource_uk` (`role_id`,`resource_id`,`deleted_at`),
  KEY `fkc_role_resource_resource_id` (`resource_id`),
  CONSTRAINT `fkc_role_resource_resource_id` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_role_resource_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `role_resource` WRITE;
/*!40000 ALTER TABLE `role_resource` DISABLE KEYS */;

INSERT INTO `role_resource` (`created_at`, `updated_at`, `deleted_at`, `id`, `role_id`, `resource_id`, `permission`)
VALUES
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',1,1,1,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',2,1,2,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',3,1,3,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',4,1,4,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',5,1,5,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',7,1,7,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',8,1,8,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',9,1,9,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',11,1,11,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',12,1,12,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',13,1,13,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',15,1,15,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',16,1,16,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',17,1,17,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',19,1,19,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',21,1,21,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',22,1,22,'v'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',24,1,24,'c,r,u,d'),
	('2021-10-14 06:42:48','2022-11-22 20:59:20','0000-00-00 00:00:00',25,1,25,'c,r,u,d'),
	('2021-11-30 21:40:26','2022-11-22 20:59:20','0000-00-00 00:00:00',27,1,27,'c,r,u,d');

/*!40000 ALTER TABLE `role_resource` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session`;

CREATE TABLE `session` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;

INSERT INTO `session` (`session_id`, `expires`, `data`)
VALUES
	(X'355F5A36766A523335304F6F6D444B533951414F2D7459484268313156365477',1669412398,X'7B2265787069726573223A22323032322D31312D32355432313A33393A35372E3737315A222C22636F6F6B6965223A7B226D6178416765223A3235393230303030302C2270617468223A222F222C22687474704F6E6C79223A747275652C22736563757265223A66616C73652C2265787069726573223A22323032322D31312D32355432313A33393A35372E3737315A222C2273616D6553697465223A6E756C6C2C22646F6D61696E223A226C6F63616C686F7374227D2C2273657373696F6E4964223A22355F5A36766A523335304F6F6D444B533951414F2D7459484268313156365477222C22656E6372797074656453657373696F6E4964223A22355F5A36766A523335304F6F6D444B533951414F2D74594842683131563654772E65476435704F79494C67362F38527A4F4D5057716869595871496E4441566B6A4F72713645433256564834222C2275736572223A7B226964223A2231222C22757365725F6964223A2231222C22757365725F6E616D65223A2261646D696E222C22726F6C655F6964223A2231222C22757365725F726F6C655F6E616D65223A2261646D696E6973747261746F72222C22757365725F737461747573223A226F66666C696E65227D7D');

/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(10) unsigned NOT NULL,
  `language_id` int(10) unsigned NOT NULL,
  `profile_file_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL DEFAULT 1,
  `user_name` varchar(100) NOT NULL,
  `user_pass` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_first_name` varchar(100) NOT NULL,
  `user_last_name` varchar(100) NOT NULL,
  `user_active` tinyint(1) unsigned DEFAULT 0,
  `user_status` enum('offline','online') DEFAULT 'offline',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_user_uk` (`user_name`,`user_email`,`deleted_at`),
  KEY `fkc_user_role_id` (`role_id`),
  KEY `fkc_user_language_id` (`language_id`),
  KEY `fkc_user_profile_file_id` (`profile_file_id`),
  KEY `fkc_user_user_id` (`user_id`),
  CONSTRAINT `fkc_user_language_id` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_profile_file_id` FOREIGN KEY (`profile_file_id`) REFERENCES `file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`created_at`, `updated_at`, `deleted_at`, `id`, `role_id`, `language_id`, `profile_file_id`, `user_id`, `user_name`, `user_pass`, `user_email`, `user_first_name`, `user_last_name`, `user_active`, `user_status`)
VALUES
	('2021-10-14 06:42:49','2021-10-14 06:42:49','0000-00-00 00:00:00',1,1,1,NULL,1,'admin','$2b$12$ch.Z4new2A82e0muy4taBe.pKFVVC5eIsL/Js2vnP35BZ2XVBRu9G','eduardobc.88@gmail.com','Eduardo','Beltran Carbajal',1,'online');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table website_setting
# ------------------------------------------------------------

DROP TABLE IF EXISTS `website_setting`;

CREATE TABLE `website_setting` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `website_setting_key` varchar(100) NOT NULL,
  `website_setting_value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_website_setting_uk` (`website_setting_key`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
