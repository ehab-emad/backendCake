-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: ticket
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `air_line_features`
--

DROP TABLE IF EXISTS `air_line_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `air_line_features` (
  `id` char(36) NOT NULL,
  `air_line_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_284518711f9cbf28afc067a9d53` (`air_line_id`),
  CONSTRAINT `FK_284518711f9cbf28afc067a9d53` FOREIGN KEY (`air_line_id`) REFERENCES `air_lines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `air_line_features`
--

LOCK TABLES `air_line_features` WRITE;
/*!40000 ALTER TABLE `air_line_features` DISABLE KEYS */;
INSERT INTO `air_line_features` VALUES ('0bc418d0-5722-4893-adc5-cef8d5f53618','0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','WiFi','2025-06-01 12:08:14'),('53d3892b-8728-4736-9fe9-d31a5444dbe3','0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','Extra legroom','2025-06-01 12:08:14'),('a8b5b38a-dd5b-46b0-8c3f-21722ff1c009','3d8660aa-f021-45f9-af9b-260e8cdb8574','Free baggage','2025-06-13 19:40:59'),('fed61bfc-340c-4d75-a4d9-236ee24427df','3d8660aa-f021-45f9-af9b-260e8cdb8574','Priority boarding','2025-06-13 19:40:59');
/*!40000 ALTER TABLE `air_line_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `air_line_images`
--

DROP TABLE IF EXISTS `air_line_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `air_line_images` (
  `id` char(36) NOT NULL,
  `air_line_id` char(36) NOT NULL,
  `path` varchar(512) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_7342353102e9ebeaed756bd0fb2` (`air_line_id`),
  CONSTRAINT `FK_7342353102e9ebeaed756bd0fb2` FOREIGN KEY (`air_line_id`) REFERENCES `air_lines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `air_line_images`
--

LOCK TABLES `air_line_images` WRITE;
/*!40000 ALTER TABLE `air_line_images` DISABLE KEYS */;
INSERT INTO `air_line_images` VALUES ('c0702146-3a11-4ff9-8139-7c0d647c7e91','3d8660aa-f021-45f9-af9b-260e8cdb8574','https://example.com/airline2.jpg','2025-06-13 19:40:58'),('d256c3c6-12bd-44a9-a80b-a6459f928d76','3d8660aa-f021-45f9-af9b-260e8cdb8574','https://example.com/airline1.jpg','2025-06-13 19:40:58');
/*!40000 ALTER TABLE `air_line_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `air_line_meals`
--

DROP TABLE IF EXISTS `air_line_meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `air_line_meals` (
  `id` char(36) NOT NULL,
  `air_line_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_1a48be244f1cb143d167b1dafdf` (`air_line_id`),
  CONSTRAINT `FK_1a48be244f1cb143d167b1dafdf` FOREIGN KEY (`air_line_id`) REFERENCES `air_lines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `air_line_meals`
--

LOCK TABLES `air_line_meals` WRITE;
/*!40000 ALTER TABLE `air_line_meals` DISABLE KEYS */;
INSERT INTO `air_line_meals` VALUES ('6583c9bb-268b-4c74-a670-7282e6d7ce37','3d8660aa-f021-45f9-af9b-260e8cdb8574','Halal','2025-06-13 19:40:59'),('874f0bad-cee2-4ed5-a737-e465b51372d6','3d8660aa-f021-45f9-af9b-260e8cdb8574','Vegetarian','2025-06-13 19:40:59'),('c6f1d05e-2a4e-47cc-b138-8679517b7319','3d8660aa-f021-45f9-af9b-260e8cdb8574','Gluten-free','2025-06-13 19:40:59'),('d9f6cee9-f96f-4eeb-babb-ca6959c3b960','0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','Kosher','2025-06-01 12:08:14'),('f0d2f67b-18ae-4851-9774-2a141da68634','0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','Vegan','2025-06-01 12:08:14');
/*!40000 ALTER TABLE `air_line_meals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `air_lines`
--

DROP TABLE IF EXISTS `air_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `air_lines` (
  `id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `iata_code` varchar(10) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `flight_type` enum('international','domestic') NOT NULL,
  `meals_available` tinyint(1) NOT NULL DEFAULT '0',
  `special_offers` tinyint(1) NOT NULL DEFAULT '0',
  `collaboration_start_date` date NOT NULL,
  `contract_duration` int NOT NULL,
  `commission_rate` decimal(5,2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `airline_name` varchar(100) NOT NULL,
  `airline_type` enum('International','Domestic','Both') NOT NULL,
  `is_charter` tinyint(1) DEFAULT '0',
  `contract_start_date` date DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `additional_services` text,
  `special_amenities` text,
  `logo_url` varchar(255) DEFAULT NULL COMMENT 'URL for airline logo image',
  `promotional_images` json DEFAULT NULL COMMENT 'JSON array of additional promotional image URLs',
  `documents` json DEFAULT NULL COMMENT 'JSON array of contract/document image URLs',
  PRIMARY KEY (`id`),
  KEY `FK_94eb5ed78330b12419ffa1be393` (`client_id`),
  CONSTRAINT `FK_94eb5ed78330b12419ffa1be393` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `air_lines`
--

LOCK TABLES `air_lines` WRITE;
/*!40000 ALTER TABLE `air_lines` DISABLE KEYS */;
INSERT INTO `air_lines` VALUES ('0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','1d4765e9-904c-4be3-9ef1-61e2ecdecde7','Acme Air','+1234567890','contact@acmeair.com','AC','USA','Dallas','domestic',1,1,'2025-05-01',12,4.50,1,'2025-06-01 12:08:14','2025-06-01 12:08:14','','International',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('3d8660aa-f021-45f9-af9b-260e8cdb8574','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','Sky High Airlines','+201001234567','info@skyhigh.com','SH','Egypt','Cairo','international',1,0,'2025-01-01',12,7.50,1,'2025-06-13 19:40:58','2025-06-13 19:40:58','new','International',0,NULL,NULL,NULL,NULL,NULL,NULL,'[\"https://example.com/contract.pdf\", \"https://example.com/license.pdf\"]');
/*!40000 ALTER TABLE `air_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_users`
--

DROP TABLE IF EXISTS `auth_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `provider` enum('local','google','apple','phone') NOT NULL DEFAULT 'local',
  `provider_id` varchar(255) DEFAULT NULL,
  `phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_13d8b49e55a8b06bee6bbc828fb` (`email`),
  UNIQUE KEY `UQ_20e807eb28611a436b26a31b8c2` (`phone_number`),
  KEY `IDX_AUTH_USER_EMAIL` (`email`),
  KEY `IDX_AUTH_USER_PHONE` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_users`
--

LOCK TABLES `auth_users` WRITE;
/*!40000 ALTER TABLE `auth_users` DISABLE KEYS */;
INSERT INTO `auth_users` VALUES ('06625fb1-8c08-4a66-b70a-8def5523f990',NULL,NULL,'tejnbjst@test1567.com',NULL,'$2b$10$6RcIAil0jre.JwT6KKR3DuUd.289ObVL361fryEXyKZKwxoXNLr7i','local',NULL,0,'2025-06-02 16:49:11','2025-06-02 16:49:11'),('0f91d745-c23b-4e42-9bb1-673ae799e2d3',NULL,NULL,'dsdddddsd@test1567.com',NULL,'$2b$10$vmgR.f2JrBFCZbYHhODTbO0J418oQalOJauIwO4PM4SLNkJ0A8hu2','local',NULL,0,'2025-06-03 11:07:48','2025-06-03 11:07:48'),('1247ec29-cf8a-48d7-9830-a6e961c214be',NULL,NULL,'te773s02@gmail.com',NULL,'$2b$10$J8lpZRuTQEewD8UIaeltFew2PtJvnswPg3cRP1D0PyikqtW9EYI0G','local',NULL,0,'2025-06-10 18:53:37','2025-06-10 18:53:37'),('20d4e75c-98a5-41e9-977b-e48f9a04b5a3',NULL,NULL,'dsdsd@test1567.com',NULL,'$2b$10$OpEJXJegy/3hB.mlLNWiW.Q8tNVsG5qMcRkBOZZcx4Yv/OyL.QmxK','local',NULL,0,'2025-06-03 11:03:46','2025-06-03 11:03:46'),('2161a334-0e73-4570-9b5d-2c1ddcb9906a',NULL,NULL,'te773ff2st502@gmail.com',NULL,'$2b$10$bNQqiGGTzpritqMk1veWcuipj1htdeAHiRCCHYQWcMRkDvD3aJst.','local',NULL,0,'2025-06-10 18:46:41','2025-06-10 18:46:41'),('2161a341-bec7-4a51-9f7d-0dd8a8528553',NULL,NULL,'qq@gmail.com',NULL,'$2b$10$bMcsTBja.cc1ExBRKoqgsefMO5stvPGpJ3qVzs8DKaHAXsx7u1i9W','local',NULL,0,'2025-06-10 22:35:54','2025-06-10 22:35:54'),('2cf701f1-7c52-4cdc-91d2-1f1e368fd54d',NULL,NULL,NULL,'098282',NULL,'phone',NULL,0,'2025-06-02 22:12:48','2025-06-02 22:12:48'),('2e59e72f-cefc-4cbd-a1f8-9363989df0c5',NULL,NULL,'dsddsd@test1567.com',NULL,'$2b$10$cudxjB6GhmAOkOrhPlnl5eMcjSJo.FyJJx01upnGtoJnz/MVumRH2','local',NULL,0,'2025-06-03 11:05:45','2025-06-03 11:05:45'),('2eba5100-8768-4566-8ae2-62047b628cd0',NULL,NULL,'ldcskcsn@gmail.com',NULL,'$2b$10$NoU3VWWVtV2WS4j8eqH8TeteaDYypFkeEy33HS9zor.Pb7cakO9q6','local',NULL,0,'2025-06-10 21:26:13','2025-06-10 21:26:13'),('317c2883-d51d-47b6-bb27-eb4121a9d433',NULL,NULL,'ldckn@gmail.com',NULL,'$2b$10$ub8WY6VW.4Oqv/Sjrfmo8uzHUafoCvf9koE3GDZQLdTxtQnz3N/Fu','local',NULL,0,'2025-06-10 20:47:48','2025-06-10 20:47:48'),('321c5ec9-ba49-4dc7-8fd7-7e09b384b691',NULL,NULL,'tejst@test1567.com',NULL,'$2b$10$dsiEH7fJQ9FQDefuZ35EGu3WqepsyZxrSIK0UkKF.5Yvk.1TSEKbK','local',NULL,0,'2025-06-01 17:56:29','2025-06-01 17:56:29'),('390dcd53-38a5-455f-bdb2-3ba7b4f366fa',NULL,NULL,'gg@gmail.com',NULL,'$2b$10$Nt19tyB0smLTiqqhvTRrNev8a6lvgchnRCKc7EFCs5xZzDUhkHSkK','local',NULL,0,'2025-06-10 19:36:04','2025-06-10 19:36:04'),('3f7bedb8-0484-4619-bb43-1d756295f725',NULL,NULL,'dsdddsd@test1567.com',NULL,'$2b$10$Gpq6mvba9TZBlhh6eAbsh.VHuIQ2DJ0K6.kaeHjaPdqG9UDooUUU2','local',NULL,0,'2025-06-03 11:06:43','2025-06-03 11:06:43'),('42bf79d8-cf3c-4c12-b712-660ece6163ed',NULL,NULL,'te7st502@gmail.com',NULL,'$2b$10$yS.CsrtLAugBqUMAgNpVmeMggup3dT5xlk04s4Ujhc/duF5vzDwMO','local',NULL,0,'2025-06-03 11:21:19','2025-06-03 11:21:19'),('43aa0ef5-fd3b-4815-b2f0-9839c8c935ff',NULL,NULL,'wrjdfh@gmail.com',NULL,'$2b$10$NbhFNSSBGVy6sYs.La6VW.dM8wf6.wtDOJE.rATHIDqmkCR/fRQ5e','local',NULL,0,'2025-06-10 22:43:40','2025-06-10 22:43:40'),('4cbdf923-64f9-4177-8347-e5faa853cd54',NULL,NULL,'lk@gmail.com',NULL,'$2b$10$2RosaODm/R93RDMbPR4YxubnPI4BuPssJ0EIvUuPjnMLW.0yiFJ9y','local',NULL,0,'2025-06-10 20:01:46','2025-06-10 20:01:46'),('525c5d26-4ac2-4945-bb6d-5d4e63163e86',NULL,NULL,'user11@example.com',NULL,'$2b$10$oSyUvMU5yqPOVsAD2HUEZefA3Dk9IqWFGMlHL9djDd4S6Hw8passO','local',NULL,0,'2025-06-01 17:47:44','2025-06-01 17:47:44'),('56b79f36-b4cc-4b87-9e09-ff3ba9f7541e',NULL,NULL,'qdddq@gmail.com',NULL,'$2b$10$X84pI2dIae78XyK9SqSFK.wb.cAgpeRxwMwiO5aIsVcVWqaqp/nzO','local',NULL,0,'2025-06-10 22:36:06','2025-06-10 22:36:06'),('721f58bc-b229-4a6c-a773-f0317f161474',NULL,NULL,'te77m3ssms02@gmail.com',NULL,'$2b$10$jLnUxugKxSHeUYEE.L.zVu9V8GdIaAEnLAo5BZ6DKrp8Con3ugZa.','local',NULL,0,'2025-06-10 19:19:44','2025-06-10 19:19:44'),('72fd7bfc-8bc8-4f69-935a-a0f82d9b3460',NULL,NULL,'test@test1567.com',NULL,'$2b$10$wqFibYegUoQMqLlUmrkkrOvrcVhGtA9MZDv1VhS4MOfDHed6DcqzS','local',NULL,0,'2025-06-01 12:08:21','2025-06-01 12:08:21'),('730f19d4-dfb6-47f6-92a1-63c775248328',NULL,NULL,'te732st502@gmail.com',NULL,'$2b$10$e8vY4rqf6H5tiExZEri9MO8KnrD5NeAdfa1CLeR6zLQlZhmKIVZie','local',NULL,0,'2025-06-03 11:26:05','2025-06-03 11:26:05'),('771a7ce4-2566-4027-9486-9eff775ffccf',NULL,NULL,NULL,'323232',NULL,'phone',NULL,0,'2025-06-03 00:23:53','2025-06-03 00:23:53'),('77d0b24c-0017-48e3-a431-5c3ccd50728d',NULL,NULL,'ldcsckcnsn@gmail.com',NULL,'$2b$10$8gElXQ7KCEVsCAFWvCBDPe6B05EjjlRLXueesSIA8UVvai995j5Uy','local',NULL,0,'2025-06-10 22:17:07','2025-06-10 22:17:07'),('7807157e-9d69-44d1-8e3d-5fb861c9bf04',NULL,NULL,NULL,'444444',NULL,'phone',NULL,0,'2025-06-03 00:40:06','2025-06-03 00:40:06'),('789b7462-4adc-4099-8436-efa788a35844',NULL,NULL,'test502@gmail.com',NULL,'$2b$10$nBZ5fcGhoLmuYcgET8.DOuCmnHg8RBhvAI1GoD/jzIACoFznWMRzK','local',NULL,0,'2025-06-01 12:07:51','2025-06-01 12:07:51'),('809e0ccc-4b9a-4b33-b40c-b1b7f325de35',NULL,NULL,'dsd@test1567.com',NULL,'$2b$10$CjCNGtDB6izWtNLbRsqJPeWAJTsozR19MeYVbVjl5KuPVuUZEN5J2','local',NULL,0,'2025-06-03 01:27:37','2025-06-03 01:27:37'),('873ff876-ab49-41c8-8f84-9befd97c95bd',NULL,NULL,'te77m3ms02@gmail.com',NULL,'$2b$10$Z/n44fx4Q9BgOd6kOKPQ6uf4THttfUxp34FJQAPUe/6SfXWwbNqli','local',NULL,0,'2025-06-10 19:04:52','2025-06-10 19:04:52'),('8db23fe1-ac1e-4b5d-9523-3bab5dbef1fa',NULL,NULL,'ldckcsn@gmail.com',NULL,'$2b$10$qO9k3eiBYeRVIQWCWKUSv.G4VJG1XkixU6ujU47EBgUCwul8CDKF6','local',NULL,0,'2025-06-10 21:25:52','2025-06-10 21:25:52'),('92995114-0c7c-4754-84c6-9632affda311',NULL,NULL,NULL,'2001554490448','','phone',NULL,0,'2025-06-01 14:34:38','2025-06-01 14:34:38'),('96e15ac8-c332-4031-9e29-4ccbefaf2fdd',NULL,NULL,NULL,'765432',NULL,'phone',NULL,0,'2025-06-03 00:37:12','2025-06-03 00:37:12'),('97612ae1-cbbe-4da7-a8a8-e9a66ef1d259',NULL,NULL,NULL,'11111111111111111111',NULL,'phone',NULL,0,'2025-06-03 00:33:58','2025-06-03 00:33:58'),('9abb3e33-6102-4489-bad1-a81a20bba087',NULL,NULL,'usser11@example.com',NULL,'$2b$10$HvhgVzJhPUQP6mG3nrDONes/4dMjeMhLsBOgdnX55CSabJSQG6RUC','local',NULL,0,'2025-06-03 01:24:08','2025-06-03 01:24:08'),('9b501a32-2684-4a08-9490-8d400b50839c',NULL,NULL,NULL,'70000000000000',NULL,'phone',NULL,0,'2025-06-03 00:21:08','2025-06-03 00:21:08'),('9cfb79ab-b706-4bb2-941e-7d4a7d3b5bdd',NULL,NULL,'wrfdfh@gmail.com',NULL,'$2b$10$y8xlFvOPBAXTG96W5z1rQeq85Rv5YtEjiFG0biKa.pXtBzbL8LufW','local',NULL,0,'2025-06-10 22:36:15','2025-06-10 22:36:15'),('9f0987b4-76fe-4ac5-9758-334d06f538ff',NULL,NULL,'gng@gmail.com',NULL,'$2b$10$LgELm0wfrInRTJ9xscA97uO2r41jbY29X0txJqTeo/AjrKki3uf7W','local',NULL,0,'2025-06-10 19:54:40','2025-06-10 19:54:40'),('a1938234-c8f7-4bc9-9996-8a168e748c39',NULL,NULL,'te77jj32st502@gmail.com',NULL,'$2b$10$41K3xntFpPOS/LfzVV0vT.Dz/6cUXSM3btZOgc/JA6sgfBsWa7JIK','local',NULL,0,'2025-06-10 18:46:29','2025-06-10 18:46:29'),('a8f5989e-8b18-49d8-a04b-6a6bd43b547f',NULL,NULL,NULL,'8786',NULL,'phone',NULL,0,'2025-06-02 22:11:37','2025-06-02 22:11:37'),('ae936209-da2b-4845-98c3-bf536d037762',NULL,NULL,'ldcsckcsn@gmail.com',NULL,'$2b$10$XCc.f978/S4SnzzqWqyE5.lmnjmmefWeVq.Wp4CG2uikruoZXo8UK','local',NULL,0,'2025-06-10 21:54:26','2025-06-10 21:54:26'),('b27ad263-2af0-488f-acec-5959cc52418f',NULL,NULL,'user1@example.com',NULL,'$2b$10$Dw5cDOZHLQhB1UKRvt9.OOVbZl34/q/vQLg6IFkb2HxcS2wTOV9uW','local',NULL,0,'2025-06-01 14:36:29','2025-06-01 14:36:29'),('b55b1fef-9f45-4d05-8262-252860e13048',NULL,NULL,NULL,'20107519658','','phone',NULL,0,'2025-06-01 14:34:15','2025-06-01 14:34:15'),('b88f0d4d-fdd1-4d95-80b3-4315bd5c3a43',NULL,NULL,'te77m3s02@gmail.com',NULL,'$2b$10$GSpQUem3I5lZepfHwi7wROHqVN1MV.6oGCQN/fevrt1RuMWjt9R6S','local',NULL,0,'2025-06-10 19:02:17','2025-06-10 19:02:17'),('bc2fc796-fde2-4807-9768-bf666c012765',NULL,NULL,'te7732st502@gmail.com',NULL,'$2b$10$UjFG.LkZwkiThrXkCfdlhu8jcfcQVL97iMStjyUjLunROPDQG0XCi','local',NULL,0,'2025-06-10 18:44:36','2025-06-10 18:44:36'),('bc7ec48d-8d3f-4581-905d-c3374c6892e4',NULL,NULL,'88h@gmail.com',NULL,'$2b$10$VxtVmyPgUpZlo.vYaEV33OXc9GTeKrWK7PAqoO6RxGFuMtwAzAur2','local',NULL,0,'2025-06-10 19:26:37','2025-06-10 19:26:37'),('e0894980-500a-4c5e-8bcc-ff63c7472def',NULL,NULL,'tejnbst@test1567.com',NULL,'$2b$10$P8vpOd5i8RiTsTHIr2WuIO3XBRCATtfcMZ0JP9pTHg9zqOW1HjJUq','local',NULL,0,'2025-06-02 16:47:08','2025-06-02 16:47:08'),('e0ef2449-2e90-4620-bb23-b0e6b1c88593',NULL,NULL,'ldck@gmail.com',NULL,'$2b$10$ALdAI4KWqZ55PzApvgmCxumGRBhmQZJGzs89XNLtv2YlVgyguzKei','local',NULL,0,'2025-06-10 20:37:29','2025-06-10 20:37:29'),('e4a1f2b3-9c8d-4e7f-a123-4567890abcde','admin','admin','admin@example.com','2465665','$2b$10$DyYFBjqjj2UGLaOQvJymOuSJu0Glzmp/cUtuyEiX/hs7A7MryvkJS','local',NULL,0,'2025-06-01 12:07:24','2025-06-01 12:07:24'),('e503d644-05c7-42ca-8658-a3530f88c181',NULL,NULL,'ldckcn@gmail.com',NULL,'$2b$10$8a1jSHs4cbDZQvUwn5wGbePPWMFA01ThGzMW6RlsqcSLIYMV2HUgS','local',NULL,0,'2025-06-10 21:01:58','2025-06-10 21:01:58'),('e53b3a1e-05cd-4c1c-9b60-3badf960995a',NULL,NULL,'dssd@test1567.com',NULL,'$2b$10$A7/j15aii0kfcr5g0Pmlde/9qdO.dP7HBc5xFQuu.9BDI.QK7fsKG','local',NULL,0,'2025-06-03 11:03:17','2025-06-03 11:03:17'),('e61fcbe1-727d-46cd-a445-70ebee821002',NULL,NULL,'user12@example.com',NULL,'$2b$10$zKM0M5FJ875nV4zKDuMwO..taVr0dzEVOr1X7XjYd3Pp5HCP1QxxK','local',NULL,0,'2025-06-05 08:01:14','2025-06-05 08:01:14'),('f8a9e1a4-f633-4e5e-b5cd-2d4843ad1e48',NULL,NULL,'ldk@gmail.com',NULL,'$2b$10$W49vViCbr9hdyyjKjl2qPOzHQ9uGjnnYDE6vnFcuaPB1X.9x/6Hp6','local',NULL,0,'2025-06-10 20:08:10','2025-06-10 20:08:10'),('fc61d182-38ad-4d46-81e3-d9913dc1d1b5',NULL,NULL,NULL,'015544904r8',NULL,'phone',NULL,0,'2025-06-02 21:17:29','2025-06-02 21:17:29'),('feb18d61-932b-4cab-be59-309314c79919',NULL,NULL,'o8h@gmail.com',NULL,'$2b$10$8TiCN6aBt.rBNYfPRU/Zmuj8FIleWGQKf8dE1svLAseJYOQPlYraO','local',NULL,0,'2025-06-10 19:27:32','2025-06-10 19:27:32');
/*!40000 ALTER TABLE `auth_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_attachments`
--

DROP TABLE IF EXISTS `client_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_attachments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(512) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_fe6b4e623d761b732d5d70c6a45` (`client_id`),
  CONSTRAINT `FK_fe6b4e623d761b732d5d70c6a45` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_attachments`
--

LOCK TABLES `client_attachments` WRITE;
/*!40000 ALTER TABLE `client_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `additional_phone_number` varchar(50) DEFAULT NULL,
  `subscription_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_b48860677afe62cd96e12659482` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('1d4765e9-904c-4be3-9ef1-61e2ecdecde7','vv Corp12','acmemm1235@example.com','12kk address','+000000',NULL,'00000','city1','https://github.com/','00000000000','paids',1,0,'2025-06-01 12:07:45','2025-06-03 11:20:31'),('287f597f-122d-4493-96e6-1e9fd7af75fa','Acme Corp12','acvmes1235@example.com','12 address','+201006515158',NULL,'35165165','city1','https://github.com/','5264442','paid',0,1,'2025-06-01 17:49:27','2025-06-01 17:49:27'),('646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','Acme Corp12','acmedss123s5@example.com','12 address','+201006515158',NULL,'35165165','city1','https://github.com/','5264442','paid',0,1,'2025-06-03 01:27:04','2025-06-03 01:27:04'),('6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','Acme Corp12','acmes1235@example.com','12 address','+201006515158',NULL,'35165165','city1','https://github.com/','5264442','paid',0,1,'2025-06-01 14:38:44','2025-06-01 14:38:44');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth_user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_type` enum('VIP','Regular') NOT NULL DEFAULT 'Regular',
  `nationality` varchar(50) DEFAULT NULL,
  `passport_number` varchar(50) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customername` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `FK_58864ec35dabe00d492e93d9686` (`auth_user_id`),
  CONSTRAINT `FK_58864ec35dabe00d492e93d9686` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES ('09bfe2f1-dc80-42c9-b8f6-500934559445','721f58bc-b229-4a6c-a773-f0317f161474','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:19:44','2025-06-10 19:19:44',NULL,NULL,NULL),('0c87741a-e5dd-465a-a823-24e1ab24cdfa','873ff876-ab49-41c8-8f84-9befd97c95bd','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:04:52','2025-06-10 19:04:52',NULL,NULL,NULL),('0e1b1fde-795e-4b16-8764-cd0c7d69706e','4cbdf923-64f9-4177-8347-e5faa853cd54','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 20:01:46','2025-06-10 20:01:46',NULL,NULL,NULL),('211daa8b-d401-44a8-b33e-4f664fcf6ae2','390dcd53-38a5-455f-bdb2-3ba7b4f366fa','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:36:04','2025-06-10 19:36:04',NULL,NULL,NULL),('3a65d14f-c9bb-4d14-9026-eff4e84b97fc','1247ec29-cf8a-48d7-9830-a6e961c214be','Regular','AE','A12345678','address1','address2','Cairo',NULL,NULL,NULL,'2025-06-10 18:53:37','2025-06-10 18:53:37',NULL,NULL,NULL),('4bab0696-0224-4696-bf6c-c43595fb0aad','9abb3e33-6102-4489-bad1-a81a20bba087','Regular',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-03 01:24:08','2025-06-03 01:24:08',NULL,NULL,NULL),('544ba004-306d-482d-a016-f26df5812bc9','8db23fe1-ac1e-4b5d-9523-3bab5dbef1fa','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 21:25:52','2025-06-10 21:25:52',NULL,NULL,NULL),('5bcaae6a-abcf-458b-9656-a5711bc70f60','e61fcbe1-727d-46cd-a445-70ebee821002','Regular',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-05 08:01:14','2025-06-05 08:01:14',NULL,NULL,NULL),('5f0a7ec8-4b5f-4994-96e3-2c24b9b778a7','2161a334-0e73-4570-9b5d-2c1ddcb9906a','Regular','AE','A12345678','address1','address2','Cairo',NULL,NULL,NULL,'2025-06-10 18:46:41','2025-06-10 18:46:41',NULL,NULL,NULL),('6ad2897a-a11b-40b2-90d3-3b8b6b896b4e','92995114-0c7c-4754-84c6-9632affda311','Regular',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-01 14:34:38','2025-06-01 14:34:38',NULL,NULL,NULL),('77b7e41d-2777-4f66-886e-fa2787f7e213','bc7ec48d-8d3f-4581-905d-c3374c6892e4','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:26:37','2025-06-10 19:26:37',NULL,NULL,NULL),('8f3e0086-69cb-48a0-983d-37f824869f25','730f19d4-dfb6-47f6-92a1-63c775248328','VIP','zzzzzzz','zzzzzzzzzzzzzzzzzz','zzzzzzzzz','zzzzzzzzzzzzzzz','zzzzzzzzzzzzzzz','zzzzzzzzzzzz','2025-05-29','2025-06-29','2025-06-03 11:26:05','2025-06-11 13:21:52','ccccccccccccccccccc','ccccccccc@gmail.com','1111111111111111111'),('9bc40cd5-2283-4b92-b594-c49657e1023e','ae936209-da2b-4845-98c3-bf536d037762','Regular','AE','A12345678','sssssssssssssssssssssssssssssssss','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 21:54:26','2025-06-10 21:54:26',NULL,NULL,NULL),('a5324622-cf4f-42fd-a3d6-bc30d51030e9','789b7462-4adc-4099-8436-efa788a35844','Regular','AE','A12345678','address1','address2','Cairo','Egypt','2025-05-29','2025-06-29','2025-06-01 12:07:51','2025-06-01 12:07:51',NULL,NULL,NULL),('aa793e2d-f6cb-41fe-8361-0f1c15b2319a','feb18d61-932b-4cab-be59-309314c79919','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:27:32','2025-06-10 19:27:32',NULL,NULL,NULL),('ac271954-32e1-43bf-8334-351a8c4dc196','b88f0d4d-fdd1-4d95-80b3-4315bd5c3a43','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:02:17','2025-06-10 19:02:17',NULL,NULL,NULL),('ac54a34b-4aaa-4f6c-ad15-01b54870f5a9','b27ad263-2af0-488f-acec-5959cc52418f','Regular',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-01 14:36:29','2025-06-01 14:36:29',NULL,NULL,NULL),('aff8fdfb-6525-4309-8a93-42f1d5949659','b55b1fef-9f45-4d05-8262-252860e13048','Regular',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-01 14:34:15','2025-06-01 14:34:15',NULL,NULL,NULL),('b4921266-3b56-431c-baff-5c5a20136611','bc2fc796-fde2-4807-9768-bf666c012765','Regular','AE','A12345678','address1','address2','Cairo',NULL,NULL,NULL,'2025-06-10 18:44:36','2025-06-10 18:44:36',NULL,NULL,NULL),('c294bf39-c7a4-424a-83ee-7e05dfc17f5a','a1938234-c8f7-4bc9-9996-8a168e748c39','Regular','AE','A12345678','address1','address2','Cairo',NULL,NULL,NULL,'2025-06-10 18:46:29','2025-06-10 18:46:29',NULL,NULL,NULL),('c90141c0-ba21-4354-9218-b7e160c51d0c','42bf79d8-cf3c-4c12-b712-660ece6163ed','Regular','AE','A12345678','address1','address2','Cairo','Egypt','2025-05-29','2025-06-29','2025-06-03 11:21:19','2025-06-03 11:21:19',NULL,NULL,NULL),('ce0723b2-ef2e-4f04-ad34-bbcda261b4fa','e0ef2449-2e90-4620-bb23-b0e6b1c88593','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 20:37:29','2025-06-10 20:37:29',NULL,NULL,NULL),('ce9d057c-2b5c-447a-b72e-4f459aca5cd9','317c2883-d51d-47b6-bb27-eb4121a9d433','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 20:47:49','2025-06-10 20:47:49',NULL,NULL,NULL),('e041c820-c696-41f6-b195-45fdf53322f4','f8a9e1a4-f633-4e5e-b5cd-2d4843ad1e48','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 20:08:10','2025-06-10 20:08:10',NULL,NULL,NULL),('e2d5ae79-c153-4a13-8682-f184bab0caec','2eba5100-8768-4566-8ae2-62047b628cd0','Regular','AE','A12345678','sssssssssssssssssssssssssssssssss','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 21:26:14','2025-06-10 21:26:14',NULL,NULL,NULL),('e6ffd12f-ca30-40a8-bc26-f7049b2fad11','9f0987b4-76fe-4ac5-9758-334d06f538ff','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 19:54:40','2025-06-10 19:54:40',NULL,NULL,NULL),('f066be99-541b-4fa5-a267-eb628c8502cb','43aa0ef5-fd3b-4815-b2f0-9839c8c935ff','VIP','zzzzzzz','zzzzzzzzzzzzzzzzzz','zzzzzzzzz','zzzzzzzzzzzzzzz','zzzzzzzzzzzzzzz','zzzzzzzzzzzz','2025-05-29','2025-06-29','2025-06-10 22:43:41','2025-06-11 13:46:08','ccccccccccccccccccc','cccc@gmail.com','1111111111111111111'),('f24605d9-9440-458a-918b-c5558c674c45','525c5d26-4ac2-4945-bb6d-5d4e63163e86','Regular',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-01 17:47:44','2025-06-01 17:47:44',NULL,NULL,NULL),('f6bb991c-c54a-480e-8fb7-e8d9bef76867','77d0b24c-0017-48e3-a431-5c3ccd50728d','Regular','AE','A12345678','sssssssssssssssssssssssssssssssss','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 22:17:07','2025-06-10 22:17:07',NULL,NULL,NULL),('f7c367b5-539e-47b6-b0cf-098048a60cb7','e503d644-05c7-42ca-8658-a3530f88c181','Regular','AE','A12345678','address1','address2','Cairo','mmm','2025-05-29','2025-06-29','2025-06-10 21:01:58','2025-06-10 21:01:58',NULL,NULL,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_tokens`
--

DROP TABLE IF EXISTS `device_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_tokens` (
  `id` varchar(255) NOT NULL,
  `auth_user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_device_tokens_auth` (`auth_user_id`),
  CONSTRAINT `FK_device_tokens_auth` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_tokens`
--

LOCK TABLES `device_tokens` WRITE;
/*!40000 ALTER TABLE `device_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_images`
--

DROP TABLE IF EXISTS `employee_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_images` (
  `id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_3b562f8a8b32f23659831401582` (`employee_id`),
  CONSTRAINT `FK_3b562f8a8b32f23659831401582` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_images`
--

LOCK TABLES `employee_images` WRITE;
/*!40000 ALTER TABLE `employee_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth_user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_66910c68073ee5ab9b47ac04941` (`client_id`),
  KEY `FK_d41e945219681bc56a384c09787` (`auth_user_id`),
  CONSTRAINT `FK_66910c68073ee5ab9b47ac04941` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_d41e945219681bc56a384c09787` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('15f0bd41-cd57-470d-a681-8cc636cd7361','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','7807157e-9d69-44d1-8e3d-5fb861c9bf04','','null',' Product Manager',1,'2025-06-03 00:40:06','2025-06-03 01:09:33'),('247b5fcb-eb21-4052-9790-aa55b8714001','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','96e15ac8-c332-4031-9e29-4ccbefaf2fdd','','null',' Product Manager',1,'2025-06-03 00:37:12','2025-06-03 00:37:12'),('2af7b2bf-e092-475f-aac6-5a28220b3e25','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','a8f5989e-8b18-49d8-a04b-6a6bd43b547f','','uploads/employees/c3e948581adcad3109a668e2724517d4',' Product Manager',1,'2025-06-02 22:11:37','2025-06-02 22:11:37'),('2ec11c09-ca8f-4c19-96ad-a4f77c8211a9','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','fc61d182-38ad-4d46-81e3-d9913dc1d1b5','','uploads/employees/ea82b2d7b376cb6cfc9ecb3aa91e6943',' Product Manager',1,'2025-06-02 21:17:29','2025-06-02 21:17:29'),('4844d3e3-6e0d-4974-80dc-3aaffbd7c102','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','9b501a32-2684-4a08-9490-8d400b50839c','','null',' Product Manager',1,'2025-06-03 00:21:08','2025-06-03 01:06:22'),('4b1383a8-99e4-430f-8599-12645e3d29f8','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','809e0ccc-4b9a-4b33-b40c-b1b7f325de35','address 123',NULL,'admin',1,'2025-06-03 01:27:37','2025-06-03 01:27:37'),('515f632c-8623-473a-b106-ffc9f1feec6c','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','e53b3a1e-05cd-4c1c-9b60-3badf960995a','address 123',NULL,'admin',1,'2025-06-03 11:03:17','2025-06-03 11:03:17'),('5219a676-7f0d-4843-a6a5-7b8fc5ba2110','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','2e59e72f-cefc-4cbd-a1f8-9363989df0c5','address 123',NULL,'admin',1,'2025-06-03 11:05:45','2025-06-03 11:05:45'),('6b56793a-d9cc-4e5e-879c-2f275576245c','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','2cf701f1-7c52-4cdc-91d2-1f1e368fd54d','','uploads/employees/90052e83c1cae3e349db1c33cb40b803',' Product Manager',1,'2025-06-02 22:12:48','2025-06-02 22:12:48'),('8550624c-7a7d-46ff-aee5-ceda8894b2e7','287f597f-122d-4493-96e6-1e9fd7af75fa','e0894980-500a-4c5e-8bcc-ff63c7472def','address 123',NULL,'admin',1,'2025-06-02 16:47:08','2025-06-02 16:47:08'),('9d8c7ce2-bc94-44bd-8e7b-27f356b7c58a','1d4765e9-904c-4be3-9ef1-61e2ecdecde7','72fd7bfc-8bc8-4f69-935a-a0f82d9b3460','address 123','','adminss',1,'2025-06-01 12:08:21','2025-06-02 16:53:00'),('a913a671-f67f-4dfb-b236-244addb7d4cf','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','97612ae1-cbbe-4da7-a8a8-e9a66ef1d259','','null',' Product Manager',0,'2025-06-03 00:33:58','2025-06-03 01:03:53'),('b4ff87c3-920b-4302-9ca2-81ac1bd5360d','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917','771a7ce4-2566-4027-9486-9eff775ffccf','','null',' Product Manager',1,'2025-06-03 00:23:53','2025-06-03 00:23:53'),('d65f7d88-c178-4437-a31b-385913d3be9a','287f597f-122d-4493-96e6-1e9fd7af75fa','06625fb1-8c08-4a66-b70a-8def5523f990','address 123',NULL,'admin',1,'2025-06-02 16:49:11','2025-06-02 16:49:11'),('d934c709-d85f-46c6-b563-61949a75b293','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','0f91d745-c23b-4e42-9bb1-673ae799e2d3','address 123','uploads/employees/203036f9a275fa2adc68e144e54d4179','admin',1,'2025-06-03 11:07:48','2025-06-03 11:07:48'),('e94a1cec-5549-4021-839e-35455bf0f535','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','20d4e75c-98a5-41e9-977b-e48f9a04b5a3','address nn','uploads/employees/99d1261751f6dcfc7b10e52935ebfd2d','nn',0,'2025-06-03 11:03:46','2025-06-03 11:12:28'),('ee569e67-cf92-4c38-85f0-f00648cfa934','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','3f7bedb8-0484-4619-bb43-1d756295f725','address 123','uploads/employees/ae66f4d30b1235e4f55b53f5fc8ba92e','admin',1,'2025-06-03 11:06:43','2025-06-03 11:06:43'),('f4c1395b-8c36-44d3-9113-4c25928dcac0','287f597f-122d-4493-96e6-1e9fd7af75fa','321c5ec9-ba49-4dc7-8fd7-7e09b384b691','address 123',NULL,'admin',1,'2025-06-01 17:56:29','2025-06-01 17:56:29');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_amenities`
--

DROP TABLE IF EXISTS `flight_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_amenities` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `flight_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f09dd360a8da168660e7658c9a4` (`flight_id`),
  CONSTRAINT `FK_f09dd360a8da168660e7658c9a4` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_amenities`
--

LOCK TABLES `flight_amenities` WRITE;
/*!40000 ALTER TABLE `flight_amenities` DISABLE KEYS */;
INSERT INTO `flight_amenities` VALUES ('399599d9-ca36-4d49-9b46-45c10bf190f0','Extra legroom','8aadfc6c-6390-4409-a027-b6d5bdd52b45'),('510d9690-2fc3-408e-aced-71f3b8469297','WiFi','2fad23c7-2808-4206-bb58-e0b6f770d66d'),('6409ac96-1616-471a-8fe9-c2e6716a8b78','WiFi','8aadfc6c-6390-4409-a027-b6d5bdd52b45'),('83609905-1553-4e5f-acd5-c22e5df44ed5','Extra legroom','2fad23c7-2808-4206-bb58-e0b6f770d66d');
/*!40000 ALTER TABLE `flight_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_baggage`
--

DROP TABLE IF EXISTS `flight_baggage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_baggage` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `flight_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e5335770ea81306bbde1b1edb66` (`flight_id`),
  CONSTRAINT `FK_e5335770ea81306bbde1b1edb66` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_baggage`
--

LOCK TABLES `flight_baggage` WRITE;
/*!40000 ALTER TABLE `flight_baggage` DISABLE KEYS */;
INSERT INTO `flight_baggage` VALUES ('21251e7a-09a3-476f-90a4-e923a2407273','20kg','2fad23c7-2808-4206-bb58-e0b6f770d66d'),('8ff26db7-e4f6-431c-9574-2b7e39de5401','30kg','2fad23c7-2808-4206-bb58-e0b6f770d66d'),('b1fca756-9011-49d1-b6f0-445fc2348e4a','30kg','8aadfc6c-6390-4409-a027-b6d5bdd52b45'),('e9bb3f62-c599-4464-aef2-e9ade7cf51e0','20kg','8aadfc6c-6390-4409-a027-b6d5bdd52b45');
/*!40000 ALTER TABLE `flight_baggage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_meals`
--

DROP TABLE IF EXISTS `flight_meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_meals` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `flight_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ad71e63365fcdb87d4a975b5911` (`flight_id`),
  CONSTRAINT `FK_ad71e63365fcdb87d4a975b5911` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_meals`
--

LOCK TABLES `flight_meals` WRITE;
/*!40000 ALTER TABLE `flight_meals` DISABLE KEYS */;
INSERT INTO `flight_meals` VALUES ('34df57c9-3223-42df-829e-ccc5351da14f','Vegan','8aadfc6c-6390-4409-a027-b6d5bdd52b45'),('7d3904e0-fedd-46a9-a402-86ae7682413b','Halal','8aadfc6c-6390-4409-a027-b6d5bdd52b45'),('d1fd526f-65d5-49ae-9b1d-e5dcf968179e','Vegan','2fad23c7-2808-4206-bb58-e0b6f770d66d'),('ece6acad-797a-407f-a817-56fb5db62fd8','Halal','2fad23c7-2808-4206-bb58-e0b6f770d66d');
/*!40000 ALTER TABLE `flight_meals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `id` char(36) NOT NULL,
  `status` varchar(50) NOT NULL,
  `airline_id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `departure_city` varchar(100) NOT NULL,
  `arrival_city` varchar(100) NOT NULL,
  `flight_number` varchar(50) NOT NULL,
  `number_of_stops` int NOT NULL,
  `gate` varchar(10) DEFAULT NULL,
  `flight_date` date NOT NULL,
  `return_date` date NOT NULL,
  `departure_time` time NOT NULL,
  `arrival_time` time NOT NULL,
  `flight_duration` varchar(20) NOT NULL,
  `available_seats` int NOT NULL,
  `booking_class` varchar(50) NOT NULL,
  `in_flight_entertainment` varchar(100) NOT NULL,
  `usb_port_outlet` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) NOT NULL DEFAULT '0.00',
  `aircraft_type` varchar(100) NOT NULL,
  `seat_layout` varchar(100) NOT NULL,
  `seat_pitch` varchar(50) NOT NULL,
  `aircraft_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_4d5baae7cc548636b96d92c0a9b` (`client_id`),
  KEY `FK_3e5c17e6b2bba063b184d30bbaf` (`airline_id`),
  CONSTRAINT `FK_3e5c17e6b2bba063b184d30bbaf` FOREIGN KEY (`airline_id`) REFERENCES `air_lines` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_4d5baae7cc548636b96d92c0a9b` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES ('2fad23c7-2808-4206-bb58-e0b6f770d66d','true','0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','New York','London','NY100',1,'A5','2025-06-01','2025-06-03','08:00:00','20:00:00','12h',180,'Economy','test','usb',499.99,50.00,'Boeing 777','3-4-3','32in',NULL,'2025-06-15 22:49:05','2025-06-15 22:49:05'),('8aadfc6c-6390-4409-a027-b6d5bdd52b45','true','0e56bcb5-55de-4ec2-b5a3-f26c3c53ccd4','1d4765e9-904c-4be3-9ef1-61e2ecdecde7','New York','London','NY100',1,'A5','2025-06-01','2025-06-03','08:00:00','20:00:00','12h',180,'Economy','test','usb',499.99,50.00,'Boeing 777','3-4-3','32in',NULL,'2025-06-01 12:08:35','2025-06-01 12:08:35');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_amenities`
--

DROP TABLE IF EXISTS `hotel_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_amenities` (
  `id` char(36) NOT NULL,
  `hotel_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_505e0ae297dbf218358df42f102` (`hotel_id`),
  CONSTRAINT `FK_505e0ae297dbf218358df42f102` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_amenities`
--

LOCK TABLES `hotel_amenities` WRITE;
/*!40000 ALTER TABLE `hotel_amenities` DISABLE KEYS */;
INSERT INTO `hotel_amenities` VALUES ('0eb1da58-5c0b-4352-bad2-493de279a77c','1d51e7eb-117d-4aa2-9b34-84e80133d52e','Pool','2025-06-01 12:08:45'),('3ac1b2ee-45f2-4f60-85a3-d7207ff509eb','83a22a08-462a-4ff6-a816-67d01b5b6115','Swimming Pool','2025-06-13 00:00:24'),('91f48d82-77aa-4a70-8a5c-4e5cac5d12ba','1d51e7eb-117d-4aa2-9b34-84e80133d52e','Free WiFi','2025-06-01 12:08:45'),('c5485121-5eea-411b-8e3a-3844dbeb8223','83a22a08-462a-4ff6-a816-67d01b5b6115','Free Breakfast','2025-06-13 00:00:24'),('d3d4aac0-6079-4426-b9b0-a2a9525e790e','1d51e7eb-117d-4aa2-9b34-84e80133d52e','Gym','2025-06-01 12:08:45');
/*!40000 ALTER TABLE `hotel_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_images`
--

DROP TABLE IF EXISTS `hotel_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_images` (
  `id` char(36) NOT NULL,
  `hotel_id` char(36) NOT NULL,
  `path` varchar(512) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_65dd867699502f1b83455c128ce` (`hotel_id`),
  CONSTRAINT `FK_65dd867699502f1b83455c128ce` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_images`
--

LOCK TABLES `hotel_images` WRITE;
/*!40000 ALTER TABLE `hotel_images` DISABLE KEYS */;
INSERT INTO `hotel_images` VALUES ('979b4a29-47f8-4907-8f51-d22df9e28e12','1d51e7eb-117d-4aa2-9b34-84e80133d52e','uploads/photo1.jpg','2025-06-01 12:08:45'),('c4b61732-db5e-4244-a920-44d7a4ac1f24','1d51e7eb-117d-4aa2-9b34-84e80133d52e','uploads/photo2.jpg','2025-06-01 12:08:45');
/*!40000 ALTER TABLE `hotel_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `name` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `cooperation_start_date` date DEFAULT NULL,
  `renewal_date` date DEFAULT NULL,
  `commission_percentage` decimal(10,2) DEFAULT NULL,
  `breakfast_cost` decimal(10,2) DEFAULT NULL,
  `lunch_cost` decimal(10,2) DEFAULT NULL,
  `dinner_cost` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `branch_name` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `general_amenities` text,
  `dining_amenities` text,
  `wellness_amenities` text,
  `business_amenities` text,
  `other_amenities` text,
  `image_urls` json DEFAULT NULL,
  `contract_start_date` date DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `commission_rate` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `FK_5462746cf730732f60823aea30c` (`client_id`),
  CONSTRAINT `FK_5462746cf730732f60823aea30c` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES ('1d51e7eb-117d-4aa2-9b34-84e80133d52e','1d4765e9-904c-4be3-9ef1-61e2ecdecde7',1,'Seaside Resort','+123456789','hello@seasideresort.com','USA','Miami','123 Ocean Drive','Luxury beachfront resort','2025-01-01','2026-01-01',10.50,15.00,25.00,35.00,'2025-06-01 12:08:45','2025-06-01 12:08:45',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00),('83a22a08-462a-4ff6-a816-67d01b5b6115','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b',1,'Sunset Paradise Hotel','+201234567890',NULL,'Egypt','Cairo','123 Nile Street','A luxury hotel with Nile view.',NULL,NULL,NULL,NULL,NULL,NULL,'2025-06-13 00:00:24','2025-06-13 00:00:24','Downtown Branch','Ahmed Youssef','WiFi, Parking','Restaurant, Bar','Spa, Gym','Conference Room, Fax','Pet Friendly','[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"]','2025-06-01','2026-06-01',12.50);
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations_history`
--

DROP TABLE IF EXISTS `migrations_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations_history`
--

LOCK TABLES `migrations_history` WRITE;
/*!40000 ALTER TABLE `migrations_history` DISABLE KEYS */;
INSERT INTO `migrations_history` VALUES (1,240101000000,'CreateAuth20240101000000'),(2,240101000001,'CreateOtps20240101000001'),(3,240101000002,'CreateCustomers20240101000002'),(4,240101000003,'CreateClients20240101000003'),(5,240101000004,'CreateClientAttachments20240101000004'),(6,240101000005,'CreateAirLine20240101000005'),(7,240101000006,'CreateAirLineImages20240101000006'),(8,240101000007,'CreateAirLineFeatures20240101000007'),(9,240101000008,'CreateAirLineMeals20240101000008'),(10,240101000009,'CreateEmployees20240101000009'),(11,240101000010,'CreateEmployeeImages20240101000010'),(12,240101000011,'CreateFlights20240101000011'),(13,240101000012,'CreateFlightBaggage20240101000012'),(14,240101000013,'CreateFlightAmenities20240101000013'),(15,240101000014,'CreateFlightMeals20240101000014'),(16,240101000015,'CreateHotels20240101000015'),(17,240101000016,'CreateHotelImages20240101000016'),(18,240101000017,'CreateHotelAmenities20240101000017'),(19,240101000018,'CreateRooms20240101000018'),(20,240101000019,'CreateRoomImages20240101000019'),(21,240101000020,'CreateRoomAmenities20240101000020'),(22,240101000021,'CreateTrips20240101000021'),(23,240101000022,'CreateTripSchedules20240101000022'),(24,240101000023,'CreateTripImages20240101000023'),(25,240101000024,'CreateTripHotels20240101000024'),(26,240101000025,'CreateTripFlights20240101000025'),(27,240101000026,'CreateReservations20240101000026'),(28,240101000027,'CreateTickets20240101000027'),(29,240101000029,'CreateTicketMessages20240101000029'),(30,240101000029,'CreateDeviceTokens20240101000029'),(31,240501000000,'CreatePayments20240501000000');
/*!40000 ALTER TABLE `migrations_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_3938bb24b38ad395af30230bded` (`user_id`),
  CONSTRAINT `FK_3938bb24b38ad395af30230bded` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
INSERT INTO `otps` VALUES ('51119b13-de32-483a-bdbb-245936475862','b55b1fef-9f45-4d05-8262-252860e13048','$2b$10$EkvmBmsPsEZioJBbt.iQt.qbSoFNWU6M5N4WznZQl39kw2LoTVFGi','2025-06-01 14:34:15','2025-06-01 14:39:15'),('a9fd9982-d848-46af-ac1b-c14a2c2aee65','92995114-0c7c-4754-84c6-9632affda311','$2b$10$/fsFgi6L395w2UGEMLpPPOB6mzvQS28LfESQuwx9mCa28OrOKoWWa','2025-06-01 14:34:38','2025-06-01 14:39:38');
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `process_number` varchar(50) NOT NULL,
  `reservation_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `customer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_status` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_eea6f694f3911af9c7c884513cf` (`process_number`),
  KEY `FK_9ed5ff4942e09edfd44ee0ccf01` (`reservation_id`),
  KEY `FK_d0b02233df1c52323107fe7b4d7` (`customer_id`),
  KEY `FK_bce3f30c3460065a6aeca163258` (`client_id`),
  CONSTRAINT `FK_9ed5ff4942e09edfd44ee0ccf01` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_bce3f30c3460065a6aeca163258` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_d0b02233df1c52323107fe7b4d7` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservation_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room_id` char(36) DEFAULT NULL,
  `flight_id` char(36) DEFAULT NULL,
  `trip_id` char(36) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `adult` int DEFAULT NULL,
  `children` int DEFAULT NULL,
  `seat` varchar(50) DEFAULT NULL,
  `baggage` varchar(50) DEFAULT NULL,
  `meals` varchar(50) DEFAULT NULL,
  `extra_baggage` varchar(50) DEFAULT NULL,
  `airport_transfer` varchar(50) DEFAULT NULL,
  `unlimited_internet` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `extras` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_ec7bddfb31ba19db3c085f5bd2b` (`reservation_number`),
  KEY `FK_eb7027e899ba8bd29f5bee39531` (`client_id`),
  KEY `FK_f63cb79a34cdf2d47ab23f31a8b` (`customer_id`),
  KEY `FK_6aef3a04f7c96611e75d2db10fb` (`room_id`),
  KEY `FK_bdd196ab1a80d752e65505ab8fd` (`flight_id`),
  KEY `FK_8e65d43933cbb37928f015ba42b` (`trip_id`),
  CONSTRAINT `FK_6aef3a04f7c96611e75d2db10fb` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_8e65d43933cbb37928f015ba42b` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_bdd196ab1a80d752e65505ab8fd` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_eb7027e899ba8bd29f5bee39531` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_f63cb79a34cdf2d47ab23f31a8b` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES ('4c02a5fa-c12f-49db-8bbf-b94e26bfc0f7','RES-1748779790201','pending','1d4765e9-904c-4be3-9ef1-61e2ecdecde7','a5324622-cf4f-42fd-a3d6-bc30d51030e9',NULL,'8aadfc6c-6390-4409-a027-b6d5bdd52b45',NULL,NULL,NULL,2,1,'12A,12B','1 checked bag each','vegetarian',NULL,NULL,NULL,'2025-06-01 12:09:50',NULL);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/  /*!50003 TRIGGER `reservation_before_insert` BEFORE INSERT ON `reservations` FOR EACH ROW BEGIN
        IF NEW.room_id IS NOT NULL THEN
          SET @avail := (
            SELECT available_rooms
              FROM rooms
             WHERE id = NEW.room_id
             FOR UPDATE
          );
          IF @avail < 1 THEN
            SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'No rooms available for the selected dates';
          END IF;
        END IF;
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/  /*!50003 TRIGGER `reservation_after_insert` AFTER INSERT ON `reservations` FOR EACH ROW BEGIN
        IF NEW.room_id IS NOT NULL THEN
          UPDATE rooms
             SET available_rooms = available_rooms - 1,
                 status = (available_rooms - 1 > 0)
           WHERE id = NEW.room_id;
        END IF;
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/  /*!50003 TRIGGER `reservation_after_update` AFTER UPDATE ON `reservations` FOR EACH ROW BEGIN
        IF OLD.room_id IS NOT NULL THEN
          
          IF NEW.status IN ('cancelled','completed')
             AND OLD.status NOT IN ('cancelled','completed') THEN
            UPDATE rooms
               SET available_rooms = available_rooms + 1,
                   status = TRUE
             WHERE id = OLD.room_id;
          
          ELSEIF OLD.status IN ('cancelled','completed')
             AND NEW.status NOT IN ('cancelled','completed') THEN
            UPDATE rooms
               SET available_rooms = available_rooms - 1,
                   status = (available_rooms - 1 > 0)
             WHERE id = NEW.room_id;
          END IF;
        END IF;
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/  /*!50003 TRIGGER `reservation_after_delete` AFTER DELETE ON `reservations` FOR EACH ROW BEGIN
        IF OLD.room_id IS NOT NULL THEN
          UPDATE rooms
             SET available_rooms = available_rooms + 1,
                 status = TRUE
           WHERE id = OLD.room_id;
        END IF;
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_1bbdd33b01f2e52f4dd50743544` (`room_id`),
  CONSTRAINT `FK_1bbdd33b01f2e52f4dd50743544` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES ('03532001-ebb9-4254-a374-ba7046cd73e4','45f0bfeb-15d6-4bb0-be45-b7df352fc981','Balcony','2025-06-13 17:16:53'),('0b288cf5-0e46-42ae-8a5d-1d3a52b11f0e','34b75428-8cc2-4296-842f-64876dcb88ec','Ocean View','2025-06-13 17:17:49'),('6a46369e-07ce-43ab-89d9-b1b861ca3390','1944328c-d233-4d72-b62e-0836f3e045a3','Balcony','2025-06-01 12:08:59'),('8c17bdef-9d6f-4471-ae86-21d7d463e368','45f0bfeb-15d6-4bb0-be45-b7df352fc981','Minibar','2025-06-13 17:16:53'),('b585075c-0198-474a-bf2a-d792ae5bf0b8','45f0bfeb-15d6-4bb0-be45-b7df352fc981','Ocean View','2025-06-13 17:16:53'),('d666dd80-c086-4b3b-9238-3cf2cfe815ff','34b75428-8cc2-4296-842f-64876dcb88ec','Balcony','2025-06-13 17:17:49'),('d773150e-2dd9-4d80-a02d-415fde2867db','1944328c-d233-4d72-b62e-0836f3e045a3','Ocean View','2025-06-01 12:08:59'),('e94849dd-963d-45bd-ae55-f542cccc57ed','34b75428-8cc2-4296-842f-64876dcb88ec','Minibar','2025-06-13 17:17:49'),('f44b2cb7-77b2-4243-ba8b-a90a3b59beb0','1944328c-d233-4d72-b62e-0836f3e045a3','Minibar','2025-06-01 12:08:59');
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `path` varchar(512) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_5f4e74488214bfa1d5b6556ddd6` (`room_id`),
  CONSTRAINT `FK_5f4e74488214bfa1d5b6556ddd6` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES ('18c785e8-0e2e-4ee8-bf86-4f385016a7bc','34b75428-8cc2-4296-842f-64876dcb88ec','uploads/room1.jpg','2025-06-13 17:17:49'),('2afc9785-de4c-4cff-8a3a-fe8583cf29a4','1944328c-d233-4d72-b62e-0836f3e045a3','uploads/room2.jpg','2025-06-01 12:08:59'),('58a93a3a-195f-4b63-a49f-fc940baa0aae','45f0bfeb-15d6-4bb0-be45-b7df352fc981','uploads/room2.jpg','2025-06-13 17:16:53'),('85a2b4df-c366-4cd3-833e-3af385e4e191','45f0bfeb-15d6-4bb0-be45-b7df352fc981','uploads/room1.jpg','2025-06-13 17:16:53'),('8a0a4bc8-0d3e-4aac-8633-aecf4c572258','34b75428-8cc2-4296-842f-64876dcb88ec','uploads/room2.jpg','2025-06-13 17:17:49'),('e63c1afb-8c3f-48bd-90e2-8386f7410e0a','1944328c-d233-4d72-b62e-0836f3e045a3','uploads/room1.jpg','2025-06-01 12:08:59');
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_id` char(36) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `room_name` varchar(255) NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `room_rating` decimal(3,2) NOT NULL,
  `room_type` varchar(100) NOT NULL,
  `available_rooms` int NOT NULL,
  `number_of_beds` int NOT NULL,
  `number_of_guests` int NOT NULL,
  `room_size` varchar(50) NOT NULL,
  `view` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `room_category` enum('Single','Double') NOT NULL,
  `description` text,
  `max_occupancy` int NOT NULL,
  `single_bed_count` int DEFAULT '0',
  `double_bed_count` int DEFAULT '0',
  `floor_type` varchar(50) DEFAULT NULL,
  `available_quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_adcfb861ec56035ccd29931b35b` (`client_id`),
  KEY `FK_7a61484af364d0d804b21b25c7f` (`hotel_id`),
  CONSTRAINT `FK_7a61484af364d0d804b21b25c7f` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_adcfb861ec56035ccd29931b35b` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES ('1944328c-d233-4d72-b62e-0836f3e045a3','1d4765e9-904c-4be3-9ef1-61e2ecdecde7','1d51e7eb-117d-4aa2-9b34-84e80133d52e',1,'Deluxe Suite',299.99,4.50,'suite',5,2,4,'45m2','ocean','2025-06-01 12:08:59','2025-06-01 12:08:59','Single',NULL,0,0,0,NULL,0),('34b75428-8cc2-4296-842f-64876dcb88ec','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','83a22a08-462a-4ff6-a816-67d01b5b6115',1,'Deluxe Suite',299.99,4.50,'Standard',5,2,4,'45m2','ocean','2025-06-13 17:17:49','2025-06-13 17:17:49','Single',NULL,1,0,0,NULL,1),('45f0bfeb-15d6-4bb0-be45-b7df352fc981','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b','83a22a08-462a-4ff6-a816-67d01b5b6115',1,'Deluxe Suite',299.99,4.50,'suite',5,2,4,'45m2','ocean','2025-06-13 17:16:53','2025-06-13 17:16:53','Single',NULL,1,0,0,NULL,1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_attachments`
--

DROP TABLE IF EXISTS `ticket_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_attachments` (
  `id` char(36) NOT NULL,
  `ticket_id` char(36) NOT NULL,
  `path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_0301cfaf908edba6ce419eb66b0` (`ticket_id`),
  CONSTRAINT `FK_0301cfaf908edba6ce419eb66b0` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_attachments`
--

LOCK TABLES `ticket_attachments` WRITE;
/*!40000 ALTER TABLE `ticket_attachments` DISABLE KEYS */;
INSERT INTO `ticket_attachments` VALUES ('1463facc-925f-43c8-9345-1e6f177a9c5c','397a291a-36f1-4ebc-8567-c675d8100ace','uploads/tickets/board-pass-photo.png','2025-06-01 14:42:46'),('1ea84181-282e-40d4-9858-6fc16455dda1','df3fa92d-eb85-454f-8564-920960b863c3','uploads/tickets/id-scan.pdf','2025-06-01 12:10:03'),('3599d1e9-fb7c-4da6-a46b-77c070891783','901f580a-a5fa-4e53-93ef-460c8ea2ca24','uploads/tickets/id-scan.pdf','2025-06-01 17:50:16'),('69082a27-f0cc-4c20-b219-74dbe4835cdc','598680ac-8e0b-4c13-8d11-90ffd985a2e4','uploads/tickets/c6931a4d205ff3b620c961cc9b9ede74','2025-06-03 00:27:17'),('73839ccb-f87f-4051-a553-f145eb484498','901f580a-a5fa-4e53-93ef-460c8ea2ca24','uploads/tickets/board-pass-photo.png','2025-06-01 17:50:16'),('79524b2c-b03e-44dd-938d-89b3dc908478','397a291a-36f1-4ebc-8567-c675d8100ace','uploads/tickets/id-scan.pdf','2025-06-01 14:42:46'),('b8438aea-6999-433a-9286-2c5a4746042f','fa12b832-1ed1-4e35-b159-efe8df0de24f','','2025-06-02 00:03:08'),('ec29ea7e-a129-418f-ab25-46f6ecc0e51d','df3fa92d-eb85-454f-8564-920960b863c3','uploads/tickets/board-pass-photo.png','2025-06-01 12:10:03'),('ec97d338-6322-407b-afcf-830c8e73e67f','be164eda-8c43-4feb-bd32-f6eb8136afa1','uploads/tickets/84ba5f5ef8df5b7d01ccccea840de6af','2025-06-02 00:11:02'),('ff91a1c8-ea8d-46e5-a951-4ccdd041dd9a','48c8ea2f-e00a-4a50-942a-4734dfe86dd5','uploads/tickets/ff64a87be975fb613aa742db448bae60','2025-06-03 13:33:49');
/*!40000 ALTER TABLE `ticket_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_messages`
--

DROP TABLE IF EXISTS `ticket_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_messages` (
  `id` char(36) NOT NULL,
  `ticket_id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_75b3a5f421dbf7b73778da519cb` (`ticket_id`),
  KEY `FK_9d688cf346e4d786cff5b297b7a` (`client_id`),
  KEY `FK_1855fc5d18f5a461465929dab43` (`user_id`),
  CONSTRAINT `FK_1855fc5d18f5a461465929dab43` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_75b3a5f421dbf7b73778da519cb` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_9d688cf346e4d786cff5b297b7a` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_messages`
--

LOCK TABLES `ticket_messages` WRITE;
/*!40000 ALTER TABLE `ticket_messages` DISABLE KEYS */;
INSERT INTO `ticket_messages` VALUES ('073205cd-5a25-446c-b8d7-8a8ab675ce26','901f580a-a5fa-4e53-93ef-460c8ea2ca24','287f597f-122d-4493-96e6-1e9fd7af75fa',NULL,'Help needed','2025-06-01 17:50:17'),('1705586c-b72d-4547-9efe-4dbe18df6460','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 17:47:00'),('1c8e7a71-fd50-4697-8564-3cb41a8bd01a','1a151a0c-8f25-41c8-8197-bbf1029c9704','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'ssssssssssssssssss','2025-06-03 00:30:59'),('3f8b1647-7333-4979-a36f-ac74a1cfc995','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 17:44:09'),('435a23fe-e8c4-4699-b9d8-cd7c7bdfc291','397a291a-36f1-4ebc-8567-c675d8100ace','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'newwwwwwwww','2025-06-01 23:30:41'),('472ab3d1-caf9-47a1-959b-b8eac4cbd785','fa12b832-1ed1-4e35-b159-efe8df0de24f','287f597f-122d-4493-96e6-1e9fd7af75fa',NULL,'Help needed','2025-06-02 00:03:09'),('4a9f5225-639b-4320-9c8d-33db54961654','406b1861-bf37-4c2d-a515-ed5ae7a41542','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'qqqqqq','2025-06-02 00:07:50'),('5dc24073-8a36-4397-90c1-00b65b89cfab','df3fa92d-eb85-454f-8564-920960b863c3',NULL,'e4a1f2b3-9c8d-4e7f-a123-4567890abcde','Sure?please reboot your printer and try again.','2025-06-01 12:11:01'),('5e6bb3ce-3d54-4ab1-8799-67d3d988a788','598680ac-8e0b-4c13-8d11-90ffd985a2e4','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'ewwwwwwwwwwwwwwwww','2025-06-03 00:27:18'),('7992f8b9-e842-4369-ad4a-02af6033ac68','901f580a-a5fa-4e53-93ef-460c8ea2ca24','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'thanks','2025-06-01 23:31:08'),('82e63fda-2701-4257-a1a3-9826779005c7','b0d2a8d2-59af-4cb1-94bd-45445863e3c9','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'wewe','2025-06-01 23:47:10'),('84c2980b-f5ce-4dd9-9d3d-ddca08a30507','fa7a57e8-910e-4be8-ac02-e9b519efa6d7','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Help needed','2025-06-01 14:41:03'),('8a29f98d-099c-4f7c-a7ae-a7286d8af0c4','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 17:45:26'),('966d8e30-1067-470a-861d-8a36193e4d7f','c65950c3-fa74-42fa-85f6-3f6a11e15210','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'ddfdf','2025-06-03 00:32:05'),('96964eb8-b57f-4ca2-96ac-046ec9ff92f4','94a3ed80-5a76-4930-8dfe-c6d7674908b9','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'mnn','2025-06-01 23:46:53'),('a93cf757-fcba-45ad-af20-69c19c940f90','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-02 00:02:27'),('b12c53e9-1b2f-44d5-8953-d5f807b90a5a','48c8ea2f-e00a-4a50-942a-4734dfe86dd5','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b',NULL,'nn','2025-06-03 13:33:49'),('bb1d8085-6f90-47fd-9b12-9a70eb3a536a','be164eda-8c43-4feb-bd32-f6eb8136afa1','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'ok','2025-06-02 00:11:03'),('bbf113c7-f53e-43ee-baf0-debd9aabf763','df3fa92d-eb85-454f-8564-920960b863c3','1d4765e9-904c-4be3-9ef1-61e2ecdecde7',NULL,'I lost my boarding pass at the airport','2025-06-01 12:10:03'),('d0e63f28-89e6-42eb-8cf2-75bfbdf0c04f','411d62cd-f45e-4439-a585-652477788b76','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'sdsd','2025-06-02 00:06:45'),('daef3600-f750-405f-b38d-a5500af4d075','397a291a-36f1-4ebc-8567-c675d8100ace','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Help needed','2025-06-01 14:42:47'),('dfd12bc2-870d-4d31-a494-f601193e5566','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 17:46:55'),('e5bd4b00-31dc-43d1-ac3e-2abe0743ea2a','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 17:47:07'),('f390f922-b159-45e6-91ec-f40a7e52a45b','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 17:44:42'),('f577b66f-3e51-43c8-a704-fe564082222a','df3fa92d-eb85-454f-8564-920960b863c3','6d09a748-cb7d-4f8d-8d51-23e6f3bfb917',NULL,'Sure?please reboot your printer and try again.','2025-06-01 15:08:07');
/*!40000 ALTER TABLE `ticket_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` char(36) NOT NULL,
  `ticket_number` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('open','pending','closed') NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES ('1a151a0c-8f25-41c8-8197-bbf1029c9704','TICK-1748910658975','dddddddssssssss','open','2025-06-03 00:30:59','2025-06-03 00:30:58'),('397a291a-36f1-4ebc-8567-c675d8100ace','TICK-1748788966704','new','open','2025-06-01 14:42:47','2025-06-01 14:42:46'),('406b1861-bf37-4c2d-a515-ed5ae7a41542','TICK-1748822870177','aqaq','open','2025-06-02 00:07:50','2025-06-02 00:07:50'),('411d62cd-f45e-4439-a585-652477788b76','TICK-1748822805447','dss','open','2025-06-02 00:06:45','2025-06-02 00:06:45'),('48c8ea2f-e00a-4a50-942a-4734dfe86dd5','TICK-1748957629265','s1','open','2025-06-03 13:33:49','2025-06-03 13:33:49'),('598680ac-8e0b-4c13-8d11-90ffd985a2e4','TICK-1748910437729','ewwwwwww','open','2025-06-03 00:27:18','2025-06-03 00:27:17'),('901f580a-a5fa-4e53-93ef-460c8ea2ca24','TICK-1748800216535','new','open','2025-06-01 17:50:17','2025-06-01 17:50:16'),('94a3ed80-5a76-4930-8dfe-c6d7674908b9','TICK-1748821613262','mn','open','2025-06-01 23:46:53','2025-06-01 23:46:53'),('b0d2a8d2-59af-4cb1-94bd-45445863e3c9','TICK-1748821629756','wew','open','2025-06-01 23:47:10','2025-06-01 23:47:09'),('be164eda-8c43-4feb-bd32-f6eb8136afa1','TICK-1748823062529','ok','open','2025-06-02 00:11:03','2025-06-02 00:11:02'),('c65950c3-fa74-42fa-85f6-3f6a11e15210','TICK-1748910725352','fd2222fd','open','2025-06-03 00:32:05','2025-06-03 00:32:05'),('df3fa92d-eb85-454f-8564-920960b863c3','TICK-1748779803331','sire boarding pass','open','2025-06-01 12:10:03','2025-06-01 12:11:01'),('fa12b832-1ed1-4e35-b159-efe8df0de24f','TICK-1748822588636','new','open','2025-06-02 00:03:09','2025-06-02 00:03:08'),('fa7a57e8-910e-4be8-ac02-e9b519efa6d7','TICK-1748788862746','new','open','2025-06-01 14:41:03','2025-06-01 14:41:02');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_flights`
--

DROP TABLE IF EXISTS `trip_flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_flights` (
  `id` char(36) NOT NULL,
  `trip_id` char(36) NOT NULL,
  `flight_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8aa99b65a400489ca5ba05898a9` (`trip_id`),
  KEY `FK_634b0c02d0c9cf82e734b51e67f` (`flight_id`),
  CONSTRAINT `FK_634b0c02d0c9cf82e734b51e67f` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_8aa99b65a400489ca5ba05898a9` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_flights`
--

LOCK TABLES `trip_flights` WRITE;
/*!40000 ALTER TABLE `trip_flights` DISABLE KEYS */;
INSERT INTO `trip_flights` VALUES ('014c7325-a449-48ce-ac35-6eab9cc84c58','1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8','2fad23c7-2808-4206-bb58-e0b6f770d66d'),('9aeed9a8-2752-4471-81da-df3f84b0946a','7b34aacf-b137-4d89-9c55-e1400eb18e1d','8aadfc6c-6390-4409-a027-b6d5bdd52b45');
/*!40000 ALTER TABLE `trip_flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_hotels`
--

DROP TABLE IF EXISTS `trip_hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_hotels` (
  `id` char(36) NOT NULL,
  `trip_id` char(36) NOT NULL,
  `hotel_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_119b1ed60963f4688c19182deb5` (`trip_id`),
  KEY `FK_e4838877ceebc1b4c4ab1b5ce43` (`hotel_id`),
  CONSTRAINT `FK_119b1ed60963f4688c19182deb5` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_e4838877ceebc1b4c4ab1b5ce43` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_hotels`
--

LOCK TABLES `trip_hotels` WRITE;
/*!40000 ALTER TABLE `trip_hotels` DISABLE KEYS */;
INSERT INTO `trip_hotels` VALUES ('3e279307-c79c-45f1-a111-56c703203966','7b34aacf-b137-4d89-9c55-e1400eb18e1d','1d51e7eb-117d-4aa2-9b34-84e80133d52e','2025-06-01 12:09:24'),('bf618d3a-f73e-4685-b24d-e2e8602181e7','1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8','83a22a08-462a-4ff6-a816-67d01b5b6115','2025-06-16 17:04:03');
/*!40000 ALTER TABLE `trip_hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_images`
--

DROP TABLE IF EXISTS `trip_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_images` (
  `id` char(36) NOT NULL,
  `trip_id` char(36) NOT NULL,
  `path` varchar(512) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_cadbcfa5b6e10fec06fa12f0b13` (`trip_id`),
  CONSTRAINT `FK_cadbcfa5b6e10fec06fa12f0b13` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_images`
--

LOCK TABLES `trip_images` WRITE;
/*!40000 ALTER TABLE `trip_images` DISABLE KEYS */;
INSERT INTO `trip_images` VALUES ('3c069840-1d26-4fa8-baaa-fbde53393363','1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8','uploads/trip1.jpg','2025-06-16 17:04:03'),('5bfb0c9c-4fcb-45d3-aff0-2c19674f4e75','7b34aacf-b137-4d89-9c55-e1400eb18e1d','uploads/trip1.jpg','2025-06-01 12:09:24'),('8ae8f87b-02c0-4ec7-b27a-3e89027a5f87','1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8','uploads/trip2.jpg','2025-06-16 17:04:03'),('e7adc7b4-198f-4dcb-8bde-081963dd1dcb','7b34aacf-b137-4d89-9c55-e1400eb18e1d','uploads/trip2.jpg','2025-06-01 12:09:24');
/*!40000 ALTER TABLE `trip_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_schedules`
--

DROP TABLE IF EXISTS `trip_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_schedules` (
  `id` char(36) NOT NULL,
  `trip_id` char(36) NOT NULL,
  `day` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ede39de0eb67d55f8ab9e05b7d7` (`trip_id`),
  CONSTRAINT `FK_ede39de0eb67d55f8ab9e05b7d7` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_schedules`
--

LOCK TABLES `trip_schedules` WRITE;
/*!40000 ALTER TABLE `trip_schedules` DISABLE KEYS */;
INSERT INTO `trip_schedules` VALUES ('1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8','1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8',2,'City Tour','Guided walking tour'),('7b34aacf-b137-4d89-9c55-e1400eb18e1d','7b34aacf-b137-4d89-9c55-e1400eb18e1d',2,'City Tour','Guided walking tour');
/*!40000 ALTER TABLE `trip_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` char(36) NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `departure` varchar(255) NOT NULL,
  `arrival` varchar(255) NOT NULL,
  `trip_duration` varchar(50) NOT NULL,
  `includes_hotel` tinyint(1) NOT NULL DEFAULT '0',
  `includes_flight` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_d6f76c9f2ac9d54fa5e6ba58e7e` (`client_id`),
  CONSTRAINT `FK_d6f76c9f2ac9d54fa5e6ba58e7e` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES ('1b951ef1-2c6e-4b59-85e8-21a4ae1ce0f8','646e9538-8f90-4e9a-8dc0-c4c94fcbb71b',1,'New York','London','7d',1,1,'2025-06-16 17:04:03','2025-06-16 17:04:03'),('7b34aacf-b137-4d89-9c55-e1400eb18e1d','1d4765e9-904c-4be3-9ef1-61e2ecdecde7',1,'New York','London','7d',1,1,'2025-06-01 12:09:24','2025-06-01 12:09:24');
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-17  2:59:43
