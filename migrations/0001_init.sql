-- 0001_init.sql
-- MZYS Onitsha — initial schema
-- Each table stores application records as JSON documents:
--   row_id  : auto-increment surrogate key
--   id      : stable application id (also used by data/*.json seeds)
--   data    : full JSON document for the record

CREATE TABLE IF NOT EXISTS `users` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_users_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `members` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_members_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `branches` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_branches_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `events` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_events_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `finances` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_finances_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `complaints` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_complaints_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leadership` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_leadership_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_products_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `comments` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_comments_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `likes` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_likes_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_notifications_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `otps` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_otps_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
