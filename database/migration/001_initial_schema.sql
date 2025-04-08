CREATE DATABASE  IF NOT EXISTS `vibely_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vibely_db`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: vibely_db
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `entity_ID` int NOT NULL,
  `entity_Type` varchar(50) NOT NULL,
  `comment_Text` text NOT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_At` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `is_Deleted` tinyint(1) DEFAULT '0',
  `parent_Comment_ID` int DEFAULT NULL,
  `media_ID` int DEFAULT NULL,
  PRIMARY KEY (`comment_ID`),
  KEY `media_ID` (`media_ID`),
  KEY `idx_comments_user_id` (`user_ID`),
  KEY `idx_comments_entity` (`entity_ID`,`entity_Type`),
  KEY `idx_comments_parent` (`parent_Comment_ID`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`parent_Comment_ID`) REFERENCES `comments` (`comment_ID`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`media_ID`) REFERENCES `mediaassets` (`asset_ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contentfeatures`
--

DROP TABLE IF EXISTS `contentfeatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contentfeatures` (
  `feature_ID` int NOT NULL AUTO_INCREMENT,
  `content_ID` int NOT NULL,
  `content_Type` varchar(50) NOT NULL,
  `feature_Vector` json NOT NULL,
  `last_Updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feature_ID`),
  KEY `idx_contentfeatures_content` (`content_ID`,`content_Type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventattendees`
--

DROP TABLE IF EXISTS `eventattendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventattendees` (
  `registration_ID` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `user_ID` int NOT NULL,
  `registration_Time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'confirmed',
  PRIMARY KEY (`registration_ID`),
  UNIQUE KEY `event_ID` (`event_ID`,`user_ID`),
  KEY `idx_eventattendees_event_id` (`event_ID`),
  KEY `idx_eventattendees_user_id` (`user_ID`),
  CONSTRAINT `eventattendees_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE,
  CONSTRAINT `eventattendees_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventcontent`
--

DROP TABLE IF EXISTS `eventcontent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventcontent` (
  `content_ID` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `asset_ID` int NOT NULL,
  `content_Type` varchar(50) NOT NULL,
  `uploaded_By` int NOT NULL,
  `uploaded_Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `visibility` varchar(20) DEFAULT 'public',
  PRIMARY KEY (`content_ID`),
  KEY `event_ID` (`event_ID`),
  KEY `asset_ID` (`asset_ID`),
  KEY `uploaded_By` (`uploaded_By`),
  CONSTRAINT `eventcontent_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE,
  CONSTRAINT `eventcontent_ibfk_2` FOREIGN KEY (`asset_ID`) REFERENCES `mediaassets` (`asset_ID`) ON DELETE CASCADE,
  CONSTRAINT `eventcontent_ibfk_3` FOREIGN KEY (`uploaded_By`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventoccurrences`
--

DROP TABLE IF EXISTS `eventoccurrences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventoccurrences` (
  `occurrence_ID` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `pattern_ID` int NOT NULL,
  `occurrence_Date` date NOT NULL,
  `start_Time` time NOT NULL,
  `end_Time` time DEFAULT NULL,
  `is_Cancelled` tinyint(1) DEFAULT '0',
  `is_Modified` tinyint(1) DEFAULT '0',
  `modified_Name` varchar(100) DEFAULT NULL,
  `modified_Location` varchar(255) DEFAULT NULL,
  `modified_Description` text,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`occurrence_ID`),
  KEY `pattern_ID` (`pattern_ID`),
  KEY `idx_eventoccurrences_event_id` (`event_ID`),
  KEY `idx_eventoccurrences_date` (`occurrence_Date`),
  CONSTRAINT `eventoccurrences_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE,
  CONSTRAINT `eventoccurrences_ibfk_2` FOREIGN KEY (`pattern_ID`) REFERENCES `recurringeventpatterns` (`pattern_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventreviews`
--

DROP TABLE IF EXISTS `eventreviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventreviews` (
  `review_ID` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `user_ID` int NOT NULL,
  `rating` int DEFAULT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `review_Notes` text,
  PRIMARY KEY (`review_ID`),
  KEY `event_ID` (`event_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `eventreviews_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE,
  CONSTRAINT `eventreviews_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE,
  CONSTRAINT `eventreviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_ID` int NOT NULL AUTO_INCREMENT,
  `organizer_ID` int NOT NULL,
  `event_Type` varchar(50) NOT NULL,
  `event_Name` varchar(100) NOT NULL,
  `event_Location` varchar(255) DEFAULT NULL,
  `event_Category` varchar(50) DEFAULT NULL,
  `celebrity` varchar(100) DEFAULT NULL,
  `event_Date` date NOT NULL,
  `start_Time` time NOT NULL,
  `end_Time` time DEFAULT NULL,
  `event_Description` text,
  `is_Free` tinyint(1) DEFAULT '0',
  `is_Paid` tinyint(1) DEFAULT '1',
  `max_Capacity` int DEFAULT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `event_Status` varchar(20) DEFAULT 'upcoming',
  `is_Recurring` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`event_ID`),
  KEY `idx_events_organizer_id` (`organizer_ID`),
  KEY `idx_events_date` (`event_Date`),
  KEY `idx_events_category` (`event_Category`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_ID`) REFERENCES `organizers` (`organizer_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `like_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `entity_ID` int NOT NULL,
  `entity_Type` varchar(50) NOT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_ID`),
  UNIQUE KEY `user_ID` (`user_ID`,`entity_ID`,`entity_Type`),
  KEY `idx_likes_user_id` (`user_ID`),
  KEY `idx_likes_entity` (`entity_ID`,`entity_Type`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mediaassets`
--

DROP TABLE IF EXISTS `mediaassets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mediaassets` (
  `asset_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int DEFAULT NULL,
  `asset_Type` varchar(30) NOT NULL,
  `cdn_URL` varchar(255) NOT NULL,
  `original_Filename` varchar(255) DEFAULT NULL,
  `file_Size` int DEFAULT NULL,
  `upload_Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'active',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`asset_ID`),
  KEY `idx_mediaassets_user_id` (`user_ID`),
  CONSTRAINT `mediaassets_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modelperformance`
--

DROP TABLE IF EXISTS `modelperformance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelperformance` (
  `record_ID` int NOT NULL AUTO_INCREMENT,
  `model_Version` varchar(50) NOT NULL,
  `metric_Name` varchar(50) NOT NULL,
  `metric_Value` float NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organizers`
--

DROP TABLE IF EXISTS `organizers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizers` (
  `organizer_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `verification_Status` varchar(20) DEFAULT 'pending',
  `verification_Date` timestamp NULL DEFAULT NULL,
  `company_Name` varchar(100) DEFAULT NULL,
  `business_Description` text,
  `verification_DocumentURL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`organizer_ID`),
  KEY `idx_organizers_user_id` (`user_ID`),
  CONSTRAINT `organizers_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recommendedevents`
--

DROP TABLE IF EXISTS `recommendedevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendedevents` (
  `recommendation_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `event_ID` int NOT NULL,
  `score` float NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `viewed` tinyint(1) DEFAULT '0',
  `actioned` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`recommendation_ID`),
  KEY `idx_recommendations_user_id` (`user_ID`),
  KEY `idx_recommendations_event_id` (`event_ID`),
  CONSTRAINT `recommendedevents_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE,
  CONSTRAINT `recommendedevents_ibfk_2` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recurringeventpatterns`
--

DROP TABLE IF EXISTS `recurringeventpatterns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurringeventpatterns` (
  `pattern_ID` int NOT NULL AUTO_INCREMENT,
  `event_ID` int NOT NULL,
  `frequency` varchar(20) NOT NULL,
  `repeat_Interval` int DEFAULT '1',
  `days_Of_Week` varchar(20) DEFAULT NULL,
  `day_Of_Month` int DEFAULT NULL,
  `month_Of_Year` int DEFAULT NULL,
  `start_Date` date NOT NULL,
  `end_Date` date DEFAULT NULL,
  `max_Occurrences` int DEFAULT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pattern_ID`),
  KEY `idx_recurringpatterns_event_id` (`event_ID`),
  CONSTRAINT `recurringeventpatterns_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rsvps`
--

DROP TABLE IF EXISTS `rsvps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsvps` (
  `rsvp_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `event_ID` int NOT NULL,
  `rsvp_Status` varchar(20) NOT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_At` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `note` text,
  `guest_Count` int DEFAULT '1',
  PRIMARY KEY (`rsvp_ID`),
  UNIQUE KEY `user_ID` (`user_ID`,`event_ID`),
  KEY `idx_rsvps_user_id` (`user_ID`),
  KEY `idx_rsvps_event_id` (`event_ID`),
  CONSTRAINT `rsvps_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE,
  CONSTRAINT `rsvps_ibfk_2` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `saveditems`
--

DROP TABLE IF EXISTS `saveditems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saveditems` (
  `saved_Item_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `entity_ID` int NOT NULL,
  `entity_Type` varchar(50) NOT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `collection_Name` varchar(100) DEFAULT 'Default',
  PRIMARY KEY (`saved_Item_ID`),
  UNIQUE KEY `user_ID` (`user_ID`,`entity_ID`,`entity_Type`),
  CONSTRAINT `saveditems_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shares`
--

DROP TABLE IF EXISTS `shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shares` (
  `share_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `entity_ID` int NOT NULL,
  `entity_Type` varchar(50) NOT NULL,
  `share_Platform` varchar(50) DEFAULT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`share_ID`),
  KEY `idx_shares_user_id` (`user_ID`),
  KEY `idx_shares_entity` (`entity_ID`,`entity_Type`),
  CONSTRAINT `shares_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userfeatures`
--

DROP TABLE IF EXISTS `userfeatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userfeatures` (
  `feature_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `feature_Vector` json NOT NULL,
  `last_Updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feature_ID`),
  KEY `idx_userfeatures_user_id` (`user_ID`),
  CONSTRAINT `userfeatures_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userprofiles`
--

DROP TABLE IF EXISTS `userprofiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userprofiles` (
  `profile_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `profile_PictureID` int DEFAULT NULL,
  `display_Name` varchar(100) DEFAULT NULL,
  `bio` text,
  `preferences` json DEFAULT NULL,
  PRIMARY KEY (`profile_ID`),
  KEY `profile_PictureID` (`profile_PictureID`),
  KEY `idx_userprofiles_user_id` (`user_ID`),
  CONSTRAINT `userprofiles_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE,
  CONSTRAINT `userprofiles_ibfk_2` FOREIGN KEY (`profile_PictureID`) REFERENCES `mediaassets` (`asset_ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_ID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `first_Name` varchar(50) DEFAULT NULL,
  `last_Name` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `hash_Password` varchar(255) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `user_Type` varchar(20) DEFAULT 'standard',
  `account_Status` varchar(20) DEFAULT 'active',
  `date_Created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_Login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_ID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usersessions`
--

DROP TABLE IF EXISTS `usersessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersessions` (
  `session_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `ip_Address` varchar(45) DEFAULT NULL,
  `device_Info` text,
  `expiry_Time` timestamp NOT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `usersessions_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-08  1:01:38
