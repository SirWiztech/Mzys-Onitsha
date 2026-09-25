-- 0003_create_programs.sql
-- New table backing the floating "Programs Calendar" on the public site and
-- the super-admin Programs manager at /dashboard/programs. Each row is a JSON
-- document, matching the app's data-layer convention (see 0001_init.sql).
CREATE TABLE IF NOT EXISTS `programs` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_programs_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
