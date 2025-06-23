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
  CONSTRAINT `fk_pagamento_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento`
--

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
INSERT INTO `pagamento` VALUES (13,17,'Pendente'),(14,18,'Pendente'),(15,19,'Pendente'),(16,20,'Pendente');
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
  `tipo_pagamento` varchar(50) DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (17,21,'2025-06-23 01:58:46','2025-06-25','19:00:00','pix','Cancelado','integral',93.00),(18,21,'2025-06-23 02:01:52','2025-06-28','08:00:00','pix','Cancelado','integral',15.60),(19,21,'2025-06-23 02:15:09','2025-07-05','20:00:00','pix','Pendente','50%',211.20),(20,21,'2025-06-23 02:18:51','2025-06-25','20:00:00','pix','Pendente','integral',54.00);
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
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_produto` (`id_produto`),
  KEY `fk_pedidoproduto_pedido` (`id_pedido`),
  CONSTRAINT `fk_pedidoproduto_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `pedido_produto_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_produto`
--

LOCK TABLES `pedido_produto` WRITE;
/*!40000 ALTER TABLE `pedido_produto` DISABLE KEYS */;
INSERT INTO `pedido_produto` VALUES (27,17,1,30,0.90,NULL),(28,17,4,30,0.90,NULL),(29,17,7,30,0.90,NULL),(30,17,14,1,12.00,NULL),(31,18,1,10,0.78,NULL),(32,18,2,10,0.78,NULL),(33,19,11,100,0.48,NULL),(34,19,10,200,0.48,NULL),(35,19,12,140,0.48,NULL),(36,20,1,60,0.90,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (11,'julia freitas',NULL,'$2b$10$7AG63EzNWB3sMK.kmrwzVOXJrXy.W4qQDtdOeT7je1EbiSMtRcrve','31988005544','rua nao sei das quantas','78978978978'),(12,'leandra arruda',NULL,'$2b$10$uBQwEgTYQwB7WAZxw3WQ5O/1o5JEU0pdnSyl8h2xRJFf9K7EakFSG','41999999999','tqatatata','12312312312'),(13,'juliana dark',NULL,'$2b$10$iRycEJed8AmVYC59pLV2A.XDeEDVuS7.zB/Bxqtkw39cTfeIuO6Vq','51999999999','tatatat','67867867867'),(14,'l',NULL,'$2b$10$.dOKAumd7kwBCZf.yKxyVuZMNm2JjKb1iGn0ADn70ZdXC8LSdXi3O','71999999999','TATAT','88888888888'),(15,'s',NULL,'$2b$10$6.CsHjyC1IHJixFYbDnLp.mHmyUxhERyjI2boEf/DmXVGelCmh.qC','81999999999','r','11111111111'),(19,'joao henrique',NULL,'$2b$10$dH1CbNilTUySgfQxLq5Ave5hldhINw/ZMC.xjKEg5hVOTI/7FMFiq','5511945043522','sdsd','44444444444'),(20,'savio angelo',NULL,'$2b$10$.iL1xzmF27OwZ62Dm7nw1utte5EeTTjdfEahjdtouRr8C5hJQRkIi','553196419022','Rua ipanema 147','16458285644'),(21,'Luana Fialho da Silva','luana3@gmail.com','$2b$10$w/ehK5cuiH52qQHdAseZguyTh.Qjk5NQarXux5ALvt20ZoOX8cjX6','553199120697','benjamin neves 69 centro','51994179830');
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

-- Dump completed on 2025-06-23  2:23:43
