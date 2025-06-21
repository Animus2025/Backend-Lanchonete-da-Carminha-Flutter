-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: lanchonete_carminha
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `codigos`
--

DROP TABLE IF EXISTS `codigos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigos` (
  `numero` text,
  `codigo` text,
  `criadoEm` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigos`
--

LOCK TABLES `codigos` WRITE;
/*!40000 ALTER TABLE `codigos` DISABLE KEYS */;
/*!40000 ALTER TABLE `codigos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamento`
--

DROP TABLE IF EXISTS `pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamento` (
  `id_pagamento` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int DEFAULT NULL,
  `status_pagamento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_pagamento`),
  UNIQUE KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento`
--

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `data_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_retirada` date DEFAULT NULL,
  `horario_retirada` time DEFAULT NULL,
  `forma_pagamento` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_produto`
--

DROP TABLE IF EXISTS `pedido_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_produto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int DEFAULT NULL,
  `id_produto` int DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  `preco_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `pedido_produto_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  CONSTRAINT `pedido_produto_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_produto`
--

LOCK TABLES `pedido_produto` WRITE;
/*!40000 ALTER TABLE `pedido_produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `nome_produto` varchar(100) DEFAULT NULL,
  `categoria` enum('festa','assado','mini','bebida') NOT NULL,
  `estado` enum('pronto','congelado') DEFAULT NULL,
  `tipo_produto` enum('salgado','bebida') NOT NULL DEFAULT 'salgado',
  `preco_pronto` decimal(10,2) DEFAULT NULL,
  `preco_congelado` decimal(10,2) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (1,'Coxinha de Frango com Catupiry','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/coxinhafrango.jpg'),(2,'Kibe','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/kibe.jpg'),(3,'Risole de Presunto e Queijo','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/risolequeijo.jpg'),(4,'Bolinha de Queijo','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/bolinhadequeijo.jpg'),(5,'Bolinho de mandioca com carne moída','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/bolinhodemandioca.jpg'),(6,'Risole de Carne','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/risoledecarne.jpg'),(7,'Enroladinho de salsicha','festa',NULL,'salgado',0.90,0.78,'lib/assets/produtos/enroladinhasalsicha.jpg'),(8,'Pastel de Frango com Catupiry','assado',NULL,'salgado',1.00,1.00,'lib/assets/produtos/pasteldefrango.jpg'),(9,'Empadinha de Frango','assado',NULL,'salgado',1.00,1.00,'lib/assets/produtos/empada.jpg'),(10,'Coxinha de frango com catupiry','mini',NULL,'salgado',0.48,0.38,'lib/assets/produtos/coxinhadefrangomini.jpg'),(11,'Kibe','mini',NULL,'salgado',0.48,0.38,'lib/assets/produtos/kibemini.jpg'),(12,'Bolinha de queijo','mini',NULL,'salgado',0.48,0.38,'lib/assets/produtos/bolinhadequeijomini.jpg'),(13,'Coca-Cola 2 litros','bebida',NULL,'bebida',14.00,NULL,'lib/assets/produtos/coca2l.png'),(14,'Guaraná 2 litros','bebida',NULL,'bebida',12.00,NULL,'lib/assets/produtos/guarana2l.png'),(15,'Cola-cola 600ml','bebida',NULL,'bebida',7.50,NULL,'lib/assets/produtos/coca600ml.png'),(16,'Guaraná 1 litro','bebida',NULL,'bebida',7.00,NULL,'lib/assets/produtos/guarana1l.png');
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome_usuario` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefone` (`telefone`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'LUANA','luana@gmail.com','Testando*','31971454673','BENJAMIN NEVES','22255588890'),(2,'lucas','lucas@gmail.com','Testando2*','3199999999','Benjamin freitas','64563563569'),(8,'Luana Test','carminha3@example.com','$2b$10$x8dvmTwoj93nZ8gGvjXcy.sp.y.IdOXqSq7Xic311kBtykKNvoxDu','11999999999','Rua das Delícias, 123','12345678900'),(10,'luana','luana2@gmail.com','$2b$10$YJcRw1d31RlmxPMjtDQl2ul9kFCoCAxfPlAe.H5ub7YEEEl6DNT/m','31900332244','nao sei nao em','12340987654'),(11,'julia freitas',NULL,'$2b$10$7AG63EzNWB3sMK.kmrwzVOXJrXy.W4qQDtdOeT7je1EbiSMtRcrve','31988005544','rua nao sei das quantas','78978978978'),(12,'leandra arruda',NULL,'$2b$10$uBQwEgTYQwB7WAZxw3WQ5O/1o5JEU0pdnSyl8h2xRJFf9K7EakFSG','41999999999','tqatatata','12312312312'),(13,'juliana dark',NULL,'$2b$10$iRycEJed8AmVYC59pLV2A.XDeEDVuS7.zB/Bxqtkw39cTfeIuO6Vq','51999999999','tatatat','67867867867'),(14,'l',NULL,'$2b$10$.dOKAumd7kwBCZf.yKxyVuZMNm2JjKb1iGn0ADn70ZdXC8LSdXi3O','71999999999','TATAT','88888888888'),(15,'s',NULL,'$2b$10$6.CsHjyC1IHJixFYbDnLp.mHmyUxhERyjI2boEf/DmXVGelCmh.qC','81999999999','r','11111111111'),(18,'lua',NULL,'$2b$10$ubaKxCO9Dw9ZuVuEwPPxduE8.zrvw9qzjWk.GmfHUqnUsZ25lBL4K','553199120697','q','51994179830'),(19,'joao henrique',NULL,'$2b$10$dH1CbNilTUySgfQxLq5Ave5hldhINw/ZMC.xjKEg5hVOTI/7FMFiq','5511945043522','sdsd','44444444444'),(20,'savio angelo',NULL,'$2b$10$.iL1xzmF27OwZ62Dm7nw1utte5EeTTjdfEahjdtouRr8C5hJQRkIi','553196419022','Rua ipanema 147','16458285644');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-20 21:46:41
