CREATE TABLE IF NOT EXISTS dashboard_setting (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  dashboard_setting_key varchar(100) NOT NULL,
  dashboard_setting_value varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uc_dashboard_setting_uk (dashboard_setting_key, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS website_setting (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  website_setting_key varchar(100) NOT NULL,
  website_setting_value varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uc_website_setting_uk (website_setting_key, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS role (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  role_name varchar(200) NOT NULL,
  user_id int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uc_role_uk (user_id, role_name, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS resource (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  resource_name varchar(200) NOT NULL,
  resource_description varchar(255) DEFAULT '',
  resource_type ENUM('view', 'data') NOT NULL,
  resource_path varchar(255) DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY uc_resource_uk (resource_name, resource_type, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS role_resource (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  role_id int(10) unsigned NOT NULL,
  resource_id int(10) unsigned NOT NULL,
  permission varchar(100) DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY uc_role_resource_uk (role_id, resource_id, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS language (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  language_name varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uc_language_uk (language_name, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS language_message (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  language_id int(10) unsigned NOT NULL,
  language_message_key varchar(200) NOT NULL,
  language_message_value varchar(200) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uc_language_message_uk (language_id, language_message_key, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS user (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  role_id int(10) unsigned NOT NULL,
  language_id int(10) unsigned NOT NULL,
  profile_file_id int(10) unsigned DEFAULT NULL,
  user_id int(10) unsigned NOT NULL DEFAULT 1,
  user_name varchar(100) NOT NULL,
  user_pass varchar(100) NOT NULL,
  user_email varchar(100) NOT NULL,
  user_first_name varchar(100) NOT NULL,
  user_last_name varchar(100) NOT NULL,
  user_active tinyint(1) unsigned DEFAULT 0,
  user_status ENUM('offline', 'online') DEFAULT 'offline',
  PRIMARY KEY (id),
  UNIQUE KEY uc_user_uk (user_name, user_email, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS file (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  file_name varchar(200) NOT NULL,
  file_title varchar(255) DEFAULT '',
  file_description varchar(255) DEFAULT '',
  file_mime_type varchar(50) DEFAULT '',
  file_size varchar(100) DEFAULT '',
  user_id int(10) unsigned NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS notification (
  created_at datetime DEFAULT NOW(),
  updated_at datetime DEFAULT NOW(),
  deleted_at datetime DEFAULT '0000-00-00 00:00:00',
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  user_id int(10) unsigned NOT NULL,
  notification_title varchar(150) NOT NULL,
  notification_description varchar(255) DEFAULT '',
  notification_type ENUM('log', 'error') NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




-- role fk
ALTER TABLE
  role
ADD CONSTRAINT
  fkc_role_user_id
FOREIGN KEY
  (user_id)
REFERENCES
  user (id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- role_resource fk

ALTER TABLE
  role_resource
ADD CONSTRAINT
  fkc_role_resource_role_id
FOREIGN KEY
  (role_id)
REFERENCES
  role (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE
  role_resource
ADD CONSTRAINT
  fkc_role_resource_resource_id
FOREIGN KEY
  (resource_id)
REFERENCES
  resource (id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- language_message fk

ALTER TABLE
  language_message
ADD CONSTRAINT
  fkc_language_message_language_id
FOREIGN KEY
  (language_id)
REFERENCES
  language (id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- user fk

ALTER TABLE
  user
ADD CONSTRAINT
  fkc_user_role_id
FOREIGN KEY
  (role_id)
REFERENCES
  role (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE
  user
ADD CONSTRAINT
  fkc_user_language_id
FOREIGN KEY
  (language_id)
REFERENCES
  language (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE
  user
ADD CONSTRAINT
  fkc_user_profile_file_id
FOREIGN KEY
  (profile_file_id)
REFERENCES
  file (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE
  user
ADD CONSTRAINT
  fkc_user_user_id
FOREIGN KEY
  (user_id)
REFERENCES
  user (id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- file fk

ALTER TABLE
  file
ADD CONSTRAINT
  fkc_file_user_id
FOREIGN KEY
  (user_id)
REFERENCES
  user (id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- notification fk

ALTER TABLE
  notification
ADD CONSTRAINT
  fkc_notification_user_id
FOREIGN KEY
  (user_id)
REFERENCES
  user (id)
ON DELETE CASCADE
ON UPDATE CASCADE;
