--This is the Mogration tracking table
-- This table keeps track of which migration have been applied to the database

CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `version` VARCHAR(255) NOT NULL,
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert record for this migration
INSERT INTO `schema_migrations` (`version`, `description`) 
VALUES ('000_migration_table', 'Initial migration tracking table');
