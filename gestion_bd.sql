-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: incidentes_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Current Database: `incidentes_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `incidentes_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `incidentes_db`;

--
-- Table structure for table `auditoria_financiera`
--

DROP TABLE IF EXISTS `auditoria_financiera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_financiera` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `incidente_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  `tipo_cambio` varchar(50) NOT NULL,
  `accion` varchar(20) NOT NULL DEFAULT 'UPDATE',
  `entidad_afectada` varchar(80) NOT NULL DEFAULT 'Financiera',
  `registro_id` bigint NOT NULL DEFAULT '0',
  `detalle` text,
  `valor_afectado` decimal(12,2) DEFAULT NULL,
  `registro_anterior` text,
  `registro_nuevo` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `incidente_id` (`incidente_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `auditoria_financiera_ibfk_1` FOREIGN KEY (`incidente_id`) REFERENCES `incidente` (`id`) ON DELETE CASCADE,
  CONSTRAINT `auditoria_financiera_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_financiera`
--

LOCK TABLES `auditoria_financiera` WRITE;
/*!40000 ALTER TABLE `auditoria_financiera` DISABLE KEYS */;
INSERT INTO `auditoria_financiera` VALUES (1,12,8,'CREATE_Incidente','CREATE','Incidente',12,'Auditoria automatica de Incidente',1250.00,NULL,'{\"id\":12,\"titulo\":\"Incidente creado via API backend\",\"descripcion\":\"Incidencia de prueba creada por el endpoint del backend para validar el flujo sin insertar directo en BD.\",\"prioridadId\":3,\"estadoId\":1,\"costoEstimado\":1250,\"ingresos\":2400,\"creadoPorUsuarioId\":8,\"resueltoPorUsuarioId\":null,\"cliente\":\"Cliente API Demo\",\"sistemaAfectado\":\"API de autenticacion\",\"descripcionTecnica\":\"Prueba funcional de creacion de incidente por servicio REST autenticado.\",\"leccionesAprendidas\":\"Pendiente\",\"fechaResolucion\":null,\"fechaCierre\":null,\"activo\":true}',NULL,'2026-05-11 02:18:10'),(2,1,6,'UPDATE_Incidente','UPDATE','Incidente',1,'Auditoria automatica de Incidente',1200.00,'{\"id\":1,\"titulo\":\"Ataque de phishing masivo\",\"descripcion\":\"Multiples usuarios reportaron correos sospechosos con enlaces maliciosos.\",\"prioridadId\":3,\"estadoId\":4,\"costoEstimado\":1200.00,\"ingresos\":2500.00,\"creadoPorUsuarioId\":2,\"resueltoPorUsuarioId\":null,\"cliente\":\"TechCorp S.A.\",\"sistemaAfectado\":\"Correo Corporativo\",\"descripcionTecnica\":null,\"leccionesAprendidas\":null,\"fechaResolucion\":\"2026-05-11T00:42:27\",\"fechaCierre\":null,\"activo\":true}','{\"id\":1,\"titulo\":\"Ataque de phishing masivo\",\"descripcion\":\"Multiples usuarios reportaron correos sospechosos con enlaces maliciosos.\",\"prioridadId\":3,\"estadoId\":4,\"costoEstimado\":1200,\"ingresos\":25000,\"creadoPorUsuarioId\":2,\"resueltoPorUsuarioId\":null,\"cliente\":\"TechCorp S.A.\",\"sistemaAfectado\":\"Correo Corporativo\",\"descripcionTecnica\":null,\"leccionesAprendidas\":null,\"fechaResolucion\":\"2026-05-11T00:42:27\",\"fechaCierre\":null,\"activo\":true}',NULL,'2026-05-11 03:24:42'),(3,16,4,'CREATE_CostoExtra','CREATE','CostoExtra',9001,'Se registra costo extraordinario por preservacion de evidencias',1800.00,NULL,'{\"concepto\":\"Servicio de retencion legal de evidencias\",\"monto\":1800}','10.10.20.15','2026-01-12 18:10:00'),(4,18,4,'UPDATE_IncidenteCostoEstimado','UPDATE','Incidente',0,'Ajuste de costo estimado por ampliacion del alcance de remediacion',5400.00,'{\"costoEstimado\":4600}','{\"costoEstimado\":5400}','10.20.30.11','2026-02-05 22:20:00'),(5,19,4,'CREATE_CostoExtra','CREATE','CostoExtra',9002,'Se adiciona licenciamiento temporal de escaneo de secretos',650.00,NULL,'{\"concepto\":\"Escaneo premium de secretos en repositorios\",\"monto\":650}','10.30.40.7','2026-02-19 00:05:00'),(6,21,2,'CREATE_HoraTrabajada','CREATE','HoraTrabajada',9101,'Registro de horas del especialista forense',450.00,NULL,'{\"horas\":4.5,\"recurso\":\"Roberto Diaz\"}','172.16.10.14','2026-03-17 20:50:00'),(7,22,4,'CREATE_CostoExtra','CREATE','CostoExtra',9003,'Costo del proveedor perimetral por ventana extraordinaria',500.00,NULL,'{\"concepto\":\"Ventana extraordinaria de proveedor perimetral\",\"monto\":500}','10.50.60.3','2026-04-07 09:05:00'),(8,24,4,'CREATE_CostoExtra','CREATE','CostoExtra',9004,'Se registra consultoria externa especializada en Kubernetes',2400.00,NULL,'{\"concepto\":\"Revision de configuracion por tercero especializado\",\"monto\":2400}','10.60.70.22','2026-05-03 15:45:00'),(9,26,4,'CREATE_CostoExtra','CREATE','CostoExtra',9005,'Servicio de takedown del dominio malicioso',610.00,NULL,'{\"concepto\":\"Servicio de takedown de dominio fraudulento\",\"monto\":610}','10.70.80.9','2026-05-08 21:10:00'),(10,27,4,'UPDATE_IncidenteCostoEstimado','UPDATE','Incidente',0,'Incremento de costo por revisiones regulatorias adicionales',2800.00,'{\"costoEstimado\":2300}','{\"costoEstimado\":2800}','10.80.90.31','2026-05-10 03:05:00');
/*!40000 ALTER TABLE `auditoria_financiera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cambio_estado`
--

DROP TABLE IF EXISTS `cambio_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cambio_estado` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `incidente_id` bigint NOT NULL,
  `estado_anterior_id` bigint NOT NULL,
  `estado_nuevo_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  `comentario` text,
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `incidente_id` (`incidente_id`),
  KEY `estado_anterior_id` (`estado_anterior_id`),
  KEY `estado_nuevo_id` (`estado_nuevo_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `cambio_estado_ibfk_1` FOREIGN KEY (`incidente_id`) REFERENCES `incidente` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cambio_estado_ibfk_2` FOREIGN KEY (`estado_anterior_id`) REFERENCES `estado` (`id`),
  CONSTRAINT `cambio_estado_ibfk_3` FOREIGN KEY (`estado_nuevo_id`) REFERENCES `estado` (`id`),
  CONSTRAINT `cambio_estado_ibfk_4` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cambio_estado`
--

LOCK TABLES `cambio_estado` WRITE;
/*!40000 ALTER TABLE `cambio_estado` DISABLE KEYS */;
INSERT INTO `cambio_estado` VALUES (1,16,1,2,2,'Analisis inicial del incidente y validacion del alcance','2026-01-12 09:05:00'),(2,16,2,3,2,'Se aisla el bucket y se rota el acceso programatico','2026-01-12 12:15:00'),(3,16,3,4,5,'Se confirma contencion y remediacion de credenciales','2026-01-12 17:30:00'),(4,17,1,2,3,'Investigacion de autenticaciones desde ubicaciones anomalias','2026-01-28 13:10:00'),(5,17,2,4,2,'Sesion revocada y credenciales restablecidas','2026-01-28 18:20:00'),(6,17,4,5,2,'Caso documentado y cerrado con recomendaciones','2026-01-29 14:00:00'),(7,18,1,2,2,'Se valida asignacion anomala de privilegios','2026-02-05 15:00:00'),(8,18,2,7,5,'Caso pasa a revision por criticidad y cumplimiento','2026-02-05 23:45:00'),(9,19,1,2,3,'Analisis de token expuesto en artefacto movil','2026-02-18 19:30:00'),(10,19,2,4,2,'Rotacion completada y endpoints invalidados','2026-02-18 23:55:00'),(11,21,1,2,2,'Evidencia preservada y equipo aislado','2026-03-17 15:30:00'),(12,23,1,3,3,'Se aplica contencion temporal mientras responde el proveedor','2026-04-22 14:05:00'),(13,24,1,2,2,'Se inicia analisis de secretos expuestos','2026-05-02 17:10:00'),(14,24,2,6,5,'Escalado a arquitectura y plataforma por impacto transversal','2026-05-02 21:20:00'),(15,27,1,7,5,'Revision ejecutiva por impacto multi-tenant','2026-05-10 01:15:00');
/*!40000 ALTER TABLE `cambio_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costo_extra`
--

DROP TABLE IF EXISTS `costo_extra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costo_extra` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `incidente_id` bigint NOT NULL,
  `usuario_registra_id` bigint NOT NULL,
  `concepto` varchar(200) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha` date NOT NULL,
  `proveedor` varchar(150) DEFAULT NULL,
  `documento_soporte` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT 'Otros',
  `facturable` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `incidente_id` (`incidente_id`),
  KEY `usuario_registra_id` (`usuario_registra_id`),
  CONSTRAINT `costo_extra_ibfk_1` FOREIGN KEY (`incidente_id`) REFERENCES `incidente` (`id`) ON DELETE CASCADE,
  CONSTRAINT `costo_extra_ibfk_2` FOREIGN KEY (`usuario_registra_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `costo_extra_chk_1` CHECK ((`monto` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costo_extra`
--

LOCK TABLES `costo_extra` WRITE;
/*!40000 ALTER TABLE `costo_extra` DISABLE KEYS */;
INSERT INTO `costo_extra` VALUES (1,2,5,'Licencia de herramienta de desencriptacion',2500.00,'2026-04-04','Emsisoft',NULL,'Herramientas',1,'2026-05-11 01:44:18'),(2,3,5,'Herramienta de monitoreo de APIs',1200.00,'2026-04-06','APIsec',NULL,'Herramientas',1,'2026-05-11 01:44:18'),(3,7,5,'Servicio de scanning de vulnerabilidades',800.00,'2026-04-10','Tenable',NULL,'ServiciosExternos',1,'2026-05-11 01:44:18'),(4,16,4,'Servicio de retencion legal de evidencias',1800.00,'2026-01-12','SecureChain','OC-EXF-001','ServiciosExternos',1,'2026-05-11 03:51:20'),(5,17,4,'Licencia temporal de analisis de accesos',420.00,'2026-01-28','Okta Insights','OC-VPN-004','Herramientas',1,'2026-05-11 03:51:20'),(6,18,4,'Consultoria de segregacion de funciones',2100.00,'2026-02-06','ERP Advisory','OC-ERP-009','ServiciosExternos',1,'2026-05-11 03:51:20'),(7,19,4,'Escaneo premium de secretos en repositorios',650.00,'2026-02-18','GitGuardian','OC-API-003','Herramientas',1,'2026-05-11 03:51:20'),(8,20,4,'Emision urgente de certificado EV',280.00,'2026-03-03','GlobalSign','OC-TLS-002','Licencias',1,'2026-05-11 03:51:20'),(9,21,4,'Servicio de sandboxing avanzado',950.00,'2026-03-17','AnyRun','OC-MAL-007','Herramientas',1,'2026-05-11 03:51:20'),(10,22,4,'Ventana extraordinaria de proveedor perimetral',500.00,'2026-04-07','CloudShield','OC-WAF-010','ServiciosExternos',0,'2026-05-11 03:51:20'),(11,23,4,'Soporte prioritario del proveedor MFA',390.00,'2026-04-22','Duo','OC-MFA-002','Soporte',1,'2026-05-11 03:51:20'),(12,24,4,'Revision de configuracion por tercero especializado',2400.00,'2026-05-03','KubeSec Labs','OC-K8S-011','ServiciosExternos',1,'2026-05-11 03:51:20'),(13,25,4,'Capacidad temporal de mitigacion anti-bot',320.00,'2026-05-05','DataDome','OC-BOT-001','Herramientas',1,'2026-05-11 03:51:20'),(14,26,4,'Servicio de takedown de dominio fraudulento',610.00,'2026-05-08','Netcraft','OC-DOM-005','ServiciosExternos',1,'2026-05-11 03:51:20'),(15,27,4,'Horas adicionales de licenciamiento SIEM',740.00,'2026-05-09','Splunk','OC-SIEM-006','Licencias',0,'2026-05-11 03:51:20');
/*!40000 ALTER TABLE `costo_extra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (1,'Nuevo','Incidente recien reportado','gray'),(2,'En Analisis','Equipo analizando el incidente','blue'),(3,'En Contencion','Acciones para contener el incidente','purple'),(4,'Resuelto','Incidente resuelto exitosamente','green'),(5,'Cerrado','Incidente cerrado y documentado','gray'),(6,'Escalado','Requiere intervencion de nivel superior','red'),(7,'En Revision','En revision por supervisores','yellow');
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hora_trabajada`
--

DROP TABLE IF EXISTS `hora_trabajada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hora_trabajada` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `incidente_id` bigint NOT NULL,
  `recurso_id` bigint NOT NULL,
  `usuario_registra_id` bigint NOT NULL,
  `horas` decimal(8,2) NOT NULL,
  `fecha_trabajo` date NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `facturable` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `incidente_id` (`incidente_id`),
  KEY `recurso_id` (`recurso_id`),
  KEY `usuario_registra_id` (`usuario_registra_id`),
  CONSTRAINT `hora_trabajada_ibfk_1` FOREIGN KEY (`incidente_id`) REFERENCES `incidente` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hora_trabajada_ibfk_2` FOREIGN KEY (`recurso_id`) REFERENCES `recurso` (`id`),
  CONSTRAINT `hora_trabajada_ibfk_3` FOREIGN KEY (`usuario_registra_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `hora_trabajada_chk_1` CHECK (((`horas` > 0) and (`horas` <= 24)))
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hora_trabajada`
--

LOCK TABLES `hora_trabajada` WRITE;
/*!40000 ALTER TABLE `hora_trabajada` DISABLE KEYS */;
INSERT INTO `hora_trabajada` VALUES (1,1,1,2,4.00,'2026-04-01','Analisis inicial y clasificacion',1,'2026-05-11 01:44:18'),(2,1,2,2,2.00,'2026-04-01','Bloqueo de dominios maliciosos',1,'2026-05-11 01:44:18'),(3,2,1,2,8.00,'2026-04-03','Analisis del ransomware',1,'2026-05-11 01:44:18'),(4,2,3,2,4.00,'2026-04-03','Restauracion de servidores',1,'2026-05-11 01:44:18'),(5,2,5,2,6.00,'2026-04-04','Analisis forense',1,'2026-05-11 01:44:18'),(6,6,2,3,1.00,'2026-04-07','Correccion de reglas de firewall',1,'2026-05-11 01:44:18'),(7,9,2,3,2.00,'2026-04-08','Rotacion de contrasenas',1,'2026-05-11 01:44:18'),(8,16,1,2,5.50,'2026-01-12','Analisis inicial de accesos y alcance del incidente',1,'2026-05-11 03:51:20'),(9,16,5,2,4.00,'2026-01-12','Analisis forense de artefactos descargados',1,'2026-05-11 03:51:20'),(10,16,3,2,3.50,'2026-01-12','Ajustes de arquitectura y politicas de almacenamiento',1,'2026-05-11 03:51:20'),(11,17,2,3,2.50,'2026-01-28','Validacion de accesos y revocacion de sesiones activas',1,'2026-05-11 03:51:20'),(12,17,4,3,2.00,'2026-01-28','Coordinacion de restablecimiento con mesa de ayuda',0,'2026-05-11 03:51:20'),(13,18,1,2,6.00,'2026-02-05','Revision de privilegios y auditoria de cambios',1,'2026-05-11 03:51:20'),(14,18,3,2,3.00,'2026-02-05','Ajuste de roles y segregacion de funciones',1,'2026-05-11 03:51:20'),(15,18,4,5,2.50,'2026-02-06','Seguimiento con duenio del sistema y aprobaciones',0,'2026-05-11 03:51:20'),(16,19,6,3,4.00,'2026-02-18','Rotacion de secretos y validacion de compilaciones',1,'2026-05-11 03:51:20'),(17,19,1,3,2.50,'2026-02-18','Analisis de impacto en clientes y trazas de uso',1,'2026-05-11 03:51:20'),(18,20,7,8,1.50,'2026-03-03','Renovacion de certificado y despliegue controlado',1,'2026-05-11 03:51:20'),(19,21,5,2,4.50,'2026-03-17','Extraccion de IOC y adquisicion de evidencia',1,'2026-05-11 03:51:20'),(20,21,2,2,3.00,'2026-03-17','Contencion del endpoint y aislamiento de red',1,'2026-05-11 03:51:20'),(21,22,3,8,2.00,'2026-04-07','Reversion de reglas y ajuste de controles perimetrales',1,'2026-05-11 03:51:20'),(22,22,4,5,1.50,'2026-04-07','Coordinacion de ventana y validacion de trafico legitimo',0,'2026-05-11 03:51:20'),(23,23,7,3,2.00,'2026-04-22','Revision de conectividad y canales con proveedor MFA',1,'2026-05-11 03:51:20'),(24,24,6,2,5.00,'2026-05-02','Analisis de secretos expuestos y endurecimiento de despliegues',1,'2026-05-11 03:51:20'),(25,24,3,2,4.50,'2026-05-02','Segmentacion de namespaces y reduccion de privilegios',1,'2026-05-11 03:51:20'),(26,25,7,8,1.50,'2026-05-05','Ajuste de rate limiting y bloqueo de ASN hostiles',1,'2026-05-11 03:51:20'),(27,26,2,3,2.00,'2026-05-08','Recoleccion de correos y notificacion a proveedores afectados',1,'2026-05-11 03:51:20'),(28,26,1,3,1.50,'2026-05-08','Analisis de indicadores y coordinacion de takedown',1,'2026-05-11 03:51:20'),(29,27,4,5,2.00,'2026-05-09','Aislamiento del operador y revision de accesos concedidos',0,'2026-05-11 03:51:20'),(30,27,1,5,3.00,'2026-05-09','Investigacion de consultas y clientes impactados',1,'2026-05-11 03:51:20');
/*!40000 ALTER TABLE `hora_trabajada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidente`
--

DROP TABLE IF EXISTS `incidente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidente` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `prioridad_id` bigint NOT NULL,
  `estado_id` bigint NOT NULL,
  `costo_estimado` decimal(12,2) NOT NULL,
  `ingresos` decimal(12,2) DEFAULT '0.00',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_resolucion` timestamp NULL DEFAULT NULL,
  `fecha_cierre` timestamp NULL DEFAULT NULL,
  `creado_por_usuario_id` bigint NOT NULL,
  `resuelto_por_usuario_id` bigint DEFAULT NULL,
  `cliente` varchar(150) DEFAULT NULL,
  `sistema_afectado` varchar(200) DEFAULT NULL,
  `descripcion_tecnica` text,
  `lecciones_aprendidas` text,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `prioridad_id` (`prioridad_id`),
  KEY `estado_id` (`estado_id`),
  KEY `creado_por_usuario_id` (`creado_por_usuario_id`),
  KEY `resuelto_por_usuario_id` (`resuelto_por_usuario_id`),
  CONSTRAINT `incidente_ibfk_1` FOREIGN KEY (`prioridad_id`) REFERENCES `prioridad` (`id`),
  CONSTRAINT `incidente_ibfk_2` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  CONSTRAINT `incidente_ibfk_3` FOREIGN KEY (`creado_por_usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `incidente_ibfk_4` FOREIGN KEY (`resuelto_por_usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `incidente_chk_1` CHECK ((`costo_estimado` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidente`
--

LOCK TABLES `incidente` WRITE;
/*!40000 ALTER TABLE `incidente` DISABLE KEYS */;
INSERT INTO `incidente` VALUES (1,'Ataque de phishing masivo','Multiples usuarios reportaron correos sospechosos con enlaces maliciosos.',3,4,1200.00,25000.00,'2026-05-11 01:42:27','2026-05-11 05:42:27',NULL,2,NULL,'TechCorp S.A.','Correo Corporativo',NULL,NULL,1),(2,'Ransomware en servidor critico','Servidor de base de datos principal infectado con ransomware.',4,4,5000.00,15000.00,'2026-05-11 01:42:27','2026-05-11 13:42:27',NULL,2,NULL,'Finanzas Global','Servidor BD Principal',NULL,NULL,1),(3,'Fuga de datos confidenciales','Posible exposicion de informacion de clientes debido a una API mal configurada.',4,2,3500.00,8000.00,'2026-05-11 01:42:27',NULL,NULL,3,NULL,'DataSecure','API Gateway',NULL,NULL,1),(4,'Intento de fuerza bruta','Multiples intentos fallidos de login al panel administrativo.',2,5,500.00,1000.00,'2026-05-11 01:42:27',NULL,NULL,4,NULL,'PyME Digital','Panel Admin',NULL,NULL,1),(5,'Malware en estacion de trabajo','Equipo de contabilidad presenta comportamiento anomalo.',3,1,800.00,1500.00,'2026-05-11 01:42:27',NULL,NULL,2,NULL,'Contabilidad Plus','Estacion de trabajo',NULL,NULL,1),(6,'Configuracion incorrecta de firewall','Reglas de firewall mal aplicadas causaron caida de servicios.',1,4,400.00,800.00,'2026-05-11 01:42:27','2026-05-11 03:42:27',NULL,3,NULL,'ISP Regional','Firewall Corporativo',NULL,NULL,1),(7,'Vulnerabilidad critica sin parche','Se detecto vulnerabilidad CVE-2024-1234 en servidores web.',3,2,2000.00,4000.00,'2026-05-11 01:42:27',NULL,NULL,2,NULL,'WebHosting','Servidores Web',NULL,NULL,1),(8,'Ataque DDoS masivo','Ataque de denegacion de servicio distribuido.',4,1,4000.00,12000.00,'2026-05-11 01:42:27',NULL,NULL,4,NULL,'E-commerce Express','Infraestructura Cloud',NULL,NULL,1),(9,'Ingenieria social a empleado','Empleado del area de RH compartio credenciales por telefono.',2,4,600.00,1200.00,'2026-05-11 01:42:27','2026-05-11 04:42:27',NULL,3,NULL,'Empresa Segura','Active Directory',NULL,NULL,1),(10,'Perdida de laptop corporativa','Laptop de gerente financiero extraviada con datos sensibles.',3,2,2500.00,5000.00,'2026-05-11 01:42:27',NULL,NULL,2,NULL,'Finanzas','Endpoint Management',NULL,NULL,1),(11,'Incidente de prueba creado por soporte','Registro de prueba para validar el flujo de gestion de incidentes desde el frontend.',3,1,950.00,1800.00,'2026-05-11 02:07:40',NULL,NULL,8,NULL,'Cliente Demo','Portal Web Corporativo','Prueba funcional de alta de incidente y visualizacion en el sistema.',NULL,1),(12,'Incidente creado via API backend','Incidencia de prueba creada por el endpoint del backend para validar el flujo sin insertar directo en BD.',3,1,1250.00,2400.00,'2026-05-11 02:18:10',NULL,NULL,8,NULL,'Cliente API Demo','API de autenticacion','Prueba funcional de creacion de incidente por servicio REST autenticado.','Pendiente',1),(16,'Exfiltracion de datos en bucket de respaldos','Se detecto acceso no autorizado y descarga de respaldos almacenados en nube.',4,4,6200.00,14500.00,'2026-01-12 08:15:00','2026-01-12 17:30:00',NULL,2,5,'Finanzas Global','Bucket S3 de Backups','Se identifico exposicion publica accidental y claves comprometidas en servicio de almacenamiento.','Aplicar hardening y politicas de cifrado en almacenamiento critico.',1),(17,'Compromiso de cuenta VPN ejecutiva','Se detectaron accesos desde ubicaciones inusuales con credenciales validas de un ejecutivo.',3,5,1800.00,4200.00,'2026-01-28 12:40:00','2026-01-28 18:20:00','2026-01-29 14:00:00',3,2,'Holding Andino','VPN Corporativa','Se evidencio reuse de contrasena y MFA no aplicado a perfil heredado.','Forzar MFA en perfiles privilegiados y revisar cuentas legado.',1),(18,'Acceso privilegiado no autorizado en ERP','Un usuario temporal obtuvo privilegios administrativos en modulo financiero.',4,7,5400.00,11000.00,'2026-02-05 14:25:00','2026-02-05 23:40:00',NULL,2,5,'Industria Nova','ERP Financiero','Hallazgo en matriz de permisos tras despliegue de mantenimiento con perfil mal asignado.','Formalizar aprobaciones para cambios de acceso y monitorear privilegios.',1),(19,'Fuga de token API en aplicacion movil','Se publico accidentalmente un token con privilegios extendidos en una version de prueba.',3,4,2600.00,5800.00,'2026-02-18 19:10:00','2026-02-18 23:55:00',NULL,3,2,'PagoSeguro','API Mobile Gateway','Token expuesto en artefacto descargable de beta interna y replicado por proxy externo.','Rotar secretos por pipeline y bloquear exposicion en builds de prueba.',1),(20,'Certificado TLS expirado en portal de pagos','El portal de pagos quedo inaccesible por expiracion de certificado digital.',2,5,700.00,1600.00,'2026-03-03 11:30:00','2026-03-03 13:00:00','2026-03-03 17:10:00',8,2,'Cliente API Demo','Portal de Pagos','Fallo de renovacion automatica por cambio de DNS y validacion ACME incompleta.','Monitorear expiraciones y mantener doble canal de alertamiento.',1),(21,'Malware bancario en equipo de tesoreria','Endpoint de tesoreria ejecuto binario malicioso tras descarga de adjunto fraudulento.',3,2,3100.00,6900.00,'2026-03-17 15:05:00',NULL,NULL,2,NULL,'Banco Regional','Endpoint Tesoreria','Persistencia por tarea programada y beacon periodico sobre puerto HTTPS.','Aislar equipos criticos con EDR y reforzar phishing simulation.',1),(22,'Cambios no autorizados en reglas WAF','Se modificaron reglas de inspeccion y quedaron rutas sensibles sin validacion.',3,4,2200.00,5000.00,'2026-04-07 03:10:00','2026-04-07 08:45:00',NULL,8,5,'E-commerce Express','WAF Perimetral','Cambio ejecutado por cuenta compartida sin control de sesion ni aprobacion previa.','Eliminar cuentas compartidas y registrar cambios sobre infraestructura perimetral.',1),(23,'Caida de MFA en correo corporativo','El proveedor de MFA presento intermitencia y dejo usuarios sin segundo factor.',2,3,1300.00,2600.00,'2026-04-22 13:15:00',NULL,NULL,3,NULL,'TechCorp S.A.','Correo Corporativo','Timeouts en validacion push y fail-open temporal en ciertos tenants heredados.','Configurar bypasses controlados y monitoreo de dependencia critica.',1),(24,'Despliegue inseguro en cluster Kubernetes','Se publicaron secretos en variables visibles dentro de pods de entorno productivo.',4,6,7200.00,16800.00,'2026-05-02 16:40:00',NULL,NULL,2,NULL,'WebHosting','Cluster Kubernetes','Manifest reutilizado desde staging con secretos en texto plano y permisos excesivos.','Adoptar secret manager y revisar pipelines de despliegue antes de promote.',1),(25,'Scraping agresivo sobre portal de clientes','Aumento sostenido de bots genero degradacion de servicio y alertas de fraude.',2,1,900.00,1900.00,'2026-05-05 21:25:00',NULL,NULL,8,NULL,'Empresa Segura','Portal de Clientes','Picos de requests desde ASN no habituales con bypass parcial de rate limiting.','Fortalecer mitigacion bot y afinar perfiles de trafico legitimo.',1),(26,'Suplantacion de dominio de proveedor logistico','Se detecto dominio typosquatting usado para enviar facturas falsas a proveedores.',3,4,1700.00,3900.00,'2026-05-08 14:50:00','2026-05-08 20:20:00',NULL,3,2,'PyME Digital','Correo Proveedores','Campana con SPF parcial y enlaces a sitio clonado alojado fuera del pais.','Reforzar DMARC reject y monitorear nuevos dominios similares.',1),(27,'Actividad sospechosa en consola SIEM','Un operador ejecuto consultas masivas no autorizadas sobre logs de clientes premium.',3,7,2800.00,6100.00,'2026-05-10 00:30:00',NULL,NULL,5,NULL,'DataSecure','SIEM Multi-tenant','Extraccion anomala de eventos desde consola admin fuera de ventana aprobada.','Separar perfiles operativos y reforzar monitoreo de consultas sensibles.',1);
/*!40000 ALTER TABLE `incidente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuesto`
--

DROP TABLE IF EXISTS `presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuesto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `monto_presupuestado` decimal(14,2) NOT NULL,
  `umbral_alerta_porcentaje` decimal(5,2) NOT NULL DEFAULT '10.00',
  `descripcion` varchar(250) DEFAULT NULL,
  `creado_por_usuario_id` bigint DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_presupuesto_periodo` (`fecha_inicio`,`fecha_fin`),
  KEY `creado_por_usuario_id` (`creado_por_usuario_id`),
  CONSTRAINT `presupuesto_ibfk_1` FOREIGN KEY (`creado_por_usuario_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuesto`
--

LOCK TABLES `presupuesto` WRITE;
/*!40000 ALTER TABLE `presupuesto` DISABLE KEYS */;
INSERT INTO `presupuesto` VALUES (1,'Presupuesto Abril 2026','2026-04-01','2026-04-30',15000.00,10.00,'Presupuesto mensual para operaciones y respuesta a incidentes de abril.',5,1,'2026-05-11 03:21:46'),(2,'Presupuesto Mayo 2026','2026-05-01','2026-05-31',18000.00,12.50,'Presupuesto mensual para operaciones y respuesta a incidentes de mayo.',5,1,'2026-05-11 03:21:46'),(3,'Presupuesto Junio 2026','2026-06-01','2026-06-30',21000.00,12.00,'Cobertura de operaciones, horas y gastos extraordinarios para junio.',5,1,'2026-05-11 03:51:20'),(4,'Presupuesto Julio 2026','2026-07-01','2026-07-31',23000.00,12.50,'Reserva para incidentes criticos de infraestructura y canal digital.',5,1,'2026-05-11 03:51:20'),(5,'Presupuesto Agosto 2026','2026-08-01','2026-08-31',24000.00,13.00,'Planeacion de capacidad financiera para investigaciones complejas.',5,1,'2026-05-11 03:51:20'),(6,'Presupuesto Septiembre 2026','2026-09-01','2026-09-30',22500.00,11.50,'Presupuesto operativo de continuidad y respuesta a incidentes.',5,1,'2026-05-11 03:51:20');
/*!40000 ALTER TABLE `presupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prioridad`
--

DROP TABLE IF EXISTS `prioridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prioridad` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `nivel` int NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  `tiempo_resolucion_esperado_horas` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prioridad`
--

LOCK TABLES `prioridad` WRITE;
/*!40000 ALTER TABLE `prioridad` DISABLE KEYS */;
INSERT INTO `prioridad` VALUES (1,'Baja',1,'green',48),(2,'Media',2,'yellow',24),(3,'Alta',3,'orange',8),(4,'Critica',4,'red',2);
/*!40000 ALTER TABLE `prioridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recurso`
--

DROP TABLE IF EXISTS `recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurso` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `costo_por_hora` decimal(10,2) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `recurso_chk_1` CHECK ((`costo_por_hora` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurso`
--

LOCK TABLES `recurso` WRITE;
/*!40000 ALTER TABLE `recurso` DISABLE KEYS */;
INSERT INTO `recurso` VALUES (1,'Carlos Paez','Analista de Seguridad Senior',50.00,'Respuesta a incidentes','carlos.paez@seguridad.com',1,'2026-05-11 01:42:26'),(2,'Laura Gomez','Analista de Seguridad Junior',30.00,'Monitoreo SOC','laura.gomez@seguridad.com',1,'2026-05-11 01:42:26'),(3,'Miguel Torres','Arquitecto de Seguridad',80.00,'Infraestructura','miguel.torres@seguridad.com',1,'2026-05-11 01:42:26'),(4,'Ana Martinez','Coordinadora SOC',60.00,'Gestion de incidentes','ana.martinez@seguridad.com',1,'2026-05-11 01:42:26'),(5,'Roberto Diaz','Especialista Forense',100.00,'Analisis forense digital','roberto.diaz@seguridad.com',1,'2026-05-11 01:42:26'),(6,'Sofia Ramirez','Ingeniera de Seguridad',70.00,'Pentesting','sofia.ramirez@seguridad.com',1,'2026-05-11 01:42:26'),(7,'Julian Castro','Administrador de SIEM',55.00,'Monitoreo avanzado','julian.castro@seguridad.com',1,'2026-05-11 01:42:26');
/*!40000 ALTER TABLE `recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `nivel_permiso` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'ROLE_READ_ONLY','Solo lectura - Consultores externos',1,'2026-05-11 01:42:26'),(2,'ROLE_ANALISTA','Analista de ciberseguridad - Puede gestionar incidentes',2,'2026-05-11 01:42:26'),(3,'ROLE_FINANZAS','Area financiera - Puede ver y editar costos',2,'2026-05-11 01:42:26'),(4,'ROLE_ADMIN','Administrador del sistema - Gestion completa',3,'2026-05-11 01:42:26'),(5,'ROLE_SUPER_ADMIN','Super administrador - Acceso total',4,'2026-05-11 01:42:26'),(6,'ROLE_DIRECTOR','Direccion - Acceso a dashboards y reportes',3,'2026-05-11 01:42:26');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `rol_id` bigint NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'lector','lector123','lector@ciberseguridad.com','Consultor Externo',1,1,'2026-05-11 03:29:14','2026-05-11 01:42:26'),(2,'analista1','analista123','carlos.paez@ciberseguridad.com','Carlos Paez - Analista Senior',2,1,NULL,'2026-05-11 01:42:26'),(3,'analista2','analista123','laura.gomez@ciberseguridad.com','Laura Gomez - Analista Junior',2,1,NULL,'2026-05-11 01:42:26'),(4,'finanzas','finanzas123','contabilidad@empresa.com','Maria Rodriguez - Finanzas',3,1,'2026-05-11 03:29:34','2026-05-11 01:42:26'),(5,'admin','admin123','admin@sistema.com','Administrador del Sistema',4,1,'2026-05-11 03:43:47','2026-05-11 01:42:26'),(6,'superadmin','super123','super@admin.com','Super Administrador',5,1,'2026-05-11 03:41:01','2026-05-11 01:42:26'),(7,'director','director123','direccion@empresa.com','Juan Carlos Mendez - Director',6,1,NULL,'2026-05-11 01:42:26'),(8,'analista3','analista123','analista3@ciberseguridad.com','Analista de Prueba',2,1,'2026-05-11 03:26:02','2026-05-11 02:07:14');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_incidente_completo`
--

DROP TABLE IF EXISTS `vista_incidente_completo`;
/*!50001 DROP VIEW IF EXISTS `vista_incidente_completo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_incidente_completo` AS SELECT 
 1 AS `id`,
 1 AS `titulo`,
 1 AS `descripcion`,
 1 AS `prioridad`,
 1 AS `prioridad_nivel`,
 1 AS `prioridad_color`,
 1 AS `estado`,
 1 AS `estado_color`,
 1 AS `costo_estimado`,
 1 AS `ingresos`,
 1 AS `costo_mano_obra`,
 1 AS `costo_extras`,
 1 AS `costo_real`,
 1 AS `fecha_creacion`,
 1 AS `fecha_resolucion`,
 1 AS `fecha_cierre`,
 1 AS `cliente`,
 1 AS `sistema_afectado`,
 1 AS `creado_por`,
 1 AS `horas_para_resolucion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_kpi_financiero`
--

DROP TABLE IF EXISTS `vista_kpi_financiero`;
/*!50001 DROP VIEW IF EXISTS `vista_kpi_financiero`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_kpi_financiero` AS SELECT 
 1 AS `id`,
 1 AS `titulo`,
 1 AS `costo_estimado`,
 1 AS `costo_real`,
 1 AS `ingresos`,
 1 AS `desviacion_absoluta`,
 1 AS `desviacion_porcentual`,
 1 AS `margen_absoluto`,
 1 AS `margen_porcentual`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'incidentes_db'
--

--
-- Dumping routines for database 'incidentes_db'
--

--
-- Current Database: `incidentes_db`
--

USE `incidentes_db`;

--
-- Final view structure for view `vista_incidente_completo`
--

/*!50001 DROP VIEW IF EXISTS `vista_incidente_completo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_incidente_completo` AS select `i`.`id` AS `id`,`i`.`titulo` AS `titulo`,`i`.`descripcion` AS `descripcion`,`p`.`nombre` AS `prioridad`,`p`.`nivel` AS `prioridad_nivel`,`p`.`color` AS `prioridad_color`,`e`.`nombre` AS `estado`,`e`.`color` AS `estado_color`,`i`.`costo_estimado` AS `costo_estimado`,`i`.`ingresos` AS `ingresos`,coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) AS `costo_mano_obra`,coalesce(sum(`ce`.`monto`),0) AS `costo_extras`,(coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) + coalesce(sum(`ce`.`monto`),0)) AS `costo_real`,`i`.`fecha_creacion` AS `fecha_creacion`,`i`.`fecha_resolucion` AS `fecha_resolucion`,`i`.`fecha_cierre` AS `fecha_cierre`,`i`.`cliente` AS `cliente`,`i`.`sistema_afectado` AS `sistema_afectado`,`u`.`nombre_completo` AS `creado_por`,timestampdiff(HOUR,`i`.`fecha_creacion`,coalesce(`i`.`fecha_resolucion`,`i`.`fecha_cierre`,now())) AS `horas_para_resolucion` from ((((((`incidente` `i` join `prioridad` `p` on((`i`.`prioridad_id` = `p`.`id`))) join `estado` `e` on((`i`.`estado_id` = `e`.`id`))) join `usuario` `u` on((`i`.`creado_por_usuario_id` = `u`.`id`))) left join `hora_trabajada` `h` on((`i`.`id` = `h`.`incidente_id`))) left join `recurso` `r` on((`h`.`recurso_id` = `r`.`id`))) left join `costo_extra` `ce` on((`i`.`id` = `ce`.`incidente_id`))) group by `i`.`id`,`i`.`titulo`,`i`.`descripcion`,`p`.`nombre`,`p`.`nivel`,`p`.`color`,`e`.`nombre`,`e`.`color`,`i`.`costo_estimado`,`i`.`ingresos`,`i`.`fecha_creacion`,`i`.`fecha_resolucion`,`i`.`fecha_cierre`,`i`.`cliente`,`i`.`sistema_afectado`,`u`.`nombre_completo` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_kpi_financiero`
--

/*!50001 DROP VIEW IF EXISTS `vista_kpi_financiero`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_kpi_financiero` AS select `i`.`id` AS `id`,`i`.`titulo` AS `titulo`,`i`.`costo_estimado` AS `costo_estimado`,(coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) + coalesce(sum(`ce`.`monto`),0)) AS `costo_real`,`i`.`ingresos` AS `ingresos`,((coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) + coalesce(sum(`ce`.`monto`),0)) - `i`.`costo_estimado`) AS `desviacion_absoluta`,round(((((coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) + coalesce(sum(`ce`.`monto`),0)) - `i`.`costo_estimado`) / `i`.`costo_estimado`) * 100),2) AS `desviacion_porcentual`,(`i`.`ingresos` - (coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) + coalesce(sum(`ce`.`monto`),0))) AS `margen_absoluto`,round((((`i`.`ingresos` - (coalesce(sum((`h`.`horas` * `r`.`costo_por_hora`)),0) + coalesce(sum(`ce`.`monto`),0))) / `i`.`ingresos`) * 100),2) AS `margen_porcentual` from (((`incidente` `i` left join `hora_trabajada` `h` on((`i`.`id` = `h`.`incidente_id`))) left join `recurso` `r` on((`h`.`recurso_id` = `r`.`id`))) left join `costo_extra` `ce` on((`i`.`id` = `ce`.`incidente_id`))) group by `i`.`id`,`i`.`titulo`,`i`.`costo_estimado`,`i`.`ingresos` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-10 22:53:58
