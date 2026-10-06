-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: apex_personal_os
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `aportes_metas`
--

DROP TABLE IF EXISTS `aportes_metas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aportes_metas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meta_id` int NOT NULL,
  `transaccion_id` int DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `nota` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aportes_metas_transaccion_id_key` (`transaccion_id`),
  KEY `aportes_metas_meta_id_fkey` (`meta_id`),
  CONSTRAINT `aportes_metas_meta_id_fkey` FOREIGN KEY (`meta_id`) REFERENCES `metas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `aportes_metas_transaccion_id_fkey` FOREIGN KEY (`transaccion_id`) REFERENCES `transacciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aportes_metas`
--

LOCK TABLES `aportes_metas` WRITE;
/*!40000 ALTER TABLE `aportes_metas` DISABLE KEYS */;
INSERT INTO `aportes_metas` VALUES (1,1,6,50.00,'2026-10-02 03:52:54.785','Aporte rápido desde panel de metas'),(2,1,7,50.00,'2026-10-02 03:52:54.986','Aporte rápido desde panel de metas'),(3,1,8,50.00,'2026-10-02 03:52:55.147','Aporte rápido desde panel de metas'),(4,1,9,50.00,'2026-10-02 03:52:55.548','Aporte rápido desde panel de metas'),(5,1,10,50.00,'2026-10-02 03:52:55.720','Aporte rápido desde panel de metas'),(6,1,11,50.00,'2026-10-02 03:52:55.887','Aporte rápido desde panel de metas'),(7,1,12,50.00,'2026-10-02 03:52:56.049','Aporte rápido desde panel de metas'),(8,1,13,50.00,'2026-10-02 03:52:56.236','Aporte rápido desde panel de metas');
/*!40000 ALTER TABLE `aportes_metas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias_finanzas`
--

DROP TABLE IF EXISTS `categorias_finanzas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_finanzas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('FIJO','VARIABLE','AHORRO_INVERSION','INGRESO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VARIABLE',
  `es_gasto_hormiga` tinyint(1) NOT NULL DEFAULT '0',
  `color_hex` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#06b6d4',
  `icono` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wallet',
  `presupuesto_estimado` decimal(10,2) DEFAULT NULL,
  `es_aporte_hogar` tinyint(1) NOT NULL DEFAULT '0',
  `es_comida_diaria` tinyint(1) NOT NULL DEFAULT '0',
  `es_modulo_ahorro` tinyint(1) NOT NULL DEFAULT '0',
  `es_salida_ocio` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_finanzas`
--

LOCK TABLES `categorias_finanzas` WRITE;
/*!40000 ALTER TABLE `categorias_finanzas` DISABLE KEYS */;
INSERT INTO `categorias_finanzas` VALUES (7,'Otros','VARIABLE',0,'#3b82f6','gamepad-2',150.00,0,0,0,0),(9,'Sueldo Técnico AV','INGRESO',0,'#22c55e','briefcase',1500.00,0,0,0,0),(11,'Almuerzos en Trabajo AV','VARIABLE',0,'#06b6d4','utensils',180.00,0,1,0,0),(12,'Antojos Diarios','VARIABLE',1,'#ef4444','cookie',60.00,0,0,0,0),(14,'Productos de Skin Care & Higiene','VARIABLE',0,'#ec4899','sparkles',40.00,0,0,0,0),(19,'Apoyo a Casa (Familia)','FIJO',0,'#f43f5e','heart-handshake',450.00,1,0,0,0);
/*!40000 ALTER TABLE `categorias_finanzas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnosticos_iniciales`
--

DROP TABLE IF EXISTS `diagnosticos_iniciales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnosticos_iniciales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `numero_test` int NOT NULL,
  `codigo` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `respuestas_json` json NOT NULL,
  `resumen` text COLLATE utf8mb4_unicode_ci,
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `diagnosticos_iniciales_codigo_key` (`codigo`),
  KEY `diagnosticos_iniciales_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `diagnosticos_iniciales_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosticos_iniciales`
--

LOCK TABLES `diagnosticos_iniciales` WRITE;
/*!40000 ALTER TABLE `diagnosticos_iniciales` DISABLE KEYS */;
INSERT INTO `diagnosticos_iniciales` VALUES (1,1,1,'TEST_01_ESTILO_VIDA','Test 01: Estilo de Vida, Horarios, Energía y Rutinas','ESTILO_DE_VIDA','{\"hobbies\": \"Videojuegos, manhwas, series, música\", \"picoEnergia\": \"Mediodía y tarde (10:00 AM - 6:00 PM)\", \"horarioLaboral\": \"8:30 AM a 5:30 PM\", \"horaDormirHabitual\": \"11:30 PM a 1:00 AM\", \"horarioUniversidad\": \"7:30 PM a 10:30 PM (3 días/semana)\", \"tiempoLevantarseCama\": \"< 5 minutos (rápido)\", \"horaDespertarHabitual\": \"5:30 am\", \"calidadDescansoPercibida\": \"Regular / Fatiga frecuente\", \"trasladoIdaVueltaMinutos\": 100}','Despierta 5:30 AM, duerme 11:30 PM/1:00 AM (déficit crónico). Trabajo 8:30-17:30 + Uni 19:30-22:30 (3 días). Mayor pico de energía 10 AM-6 PM. Distracción principal: TikTok/Reels al llegar a casa.','2026-10-01 21:38:08.407'),(2,1,2,'TEST_02_CUIDADO_FISICO','Test 02: Cuidado Personal, Facial y Físico','CUIDADO_PERSONAL','{\"postura\": \"Síndrome cruzado superior (cabeza adelantada ~3-4 cm, cifosis leve)\", \"afeitado\": \"Irritación con rastrillos desechables estándar\", \"tipoPielFacial\": \"Mixta reactiva (sebo en zona T, mejillas sensibles)\", \"problemasCutaneos\": [\"Acné inflamatorio leve\", \"Marcas post-acné\", \"Ojeras por falta de sueño\"], \"patronLavadoCabello\": \"Diario o interdiario (grasa antes de 24h)\"}','Piel mixta reactiva con acné leve y manchas post-inflamatorias. Cuero cabelludo graso con puntas secas. Postura con cuello adelantado (text neck) y hombros rotados por trabajo en laptop/AV.','2026-10-01 21:38:08.415'),(3,1,3,'TEST_03_NUTRICION','Test 03: Nutrición, Hidratación y Hábitos','NUTRICION','{\"tipoDieta\": \"Casera peruana (arroz, guisos, menestras)\", \"intolerancias\": \"Leche entera\", \"objetivoCalorico\": \"Superávit limpio moderado (+300 kcal) para pasar de 70kg a 75kg magros\", \"ingestaAguaLitros\": 1.8}','Comida casera en general. Desayuno a veces omitido por prisa. Consumo de agua ~1.5L-2L. Intolerancia leve a lácteos enteros. Necesidad de aumentar proteína magra (huevos, atún, pollo) para hipertrofia.','2026-10-01 21:38:08.420'),(4,1,4,'TEST_04_ESTUDIO_PRODUCTIVIDAD','Test 04: Estudio, Aprendizaje y Productividad','ESTUDIO','{\"bloquesFoco\": \"45 minutos foco / 10 minutos pausa activa\", \"metodoAcordado\": \"NotebookLM para lectura y consultas, Apex OS para disciplina y tiempo\", \"metodoAnterior\": \"Lectura pasiva y resúmenes largos (poca retención)\", \"enfoquePrincipal\": \"Programación AV (Crestron SIMPL, Construct, Q-SYS) e Ing. Sistemas 9no ciclo\"}','Estudio pasivo previo con retención baja. Foco prioritario: Crestron SIMPL/Construct y materias de sistemas. Solución: Usar NotebookLM para consultas teóricas y bloques Deep Work 45/10.','2026-10-01 21:38:08.425'),(5,1,5,'TEST_05_FINANZAS_RECURSOS','Test 05: Finanzas Personales, Gastos y Presupuesto','FINANZAS','{\"sueldoNeto\": 1500, \"planMovilFijo\": 28, \"transporteFijo\": 120, \"metaAhorroMensual\": 200, \"aporteFamiliarFijo\": 500, \"gastoHormigaFrecuente\": \"Empanadas, galletas, sándwiches y gaseosas en paraderos\"}','Ingreso S/ 1,500. Aporte a casa S/ 500 obligatorio. Transporte S/ 120, plan móvil S/ 28. Fugas en snacks callejeros (gastos hormiga). Margen variable de S/ 652 con meta de ahorro de S/ 200.','2026-10-01 21:38:08.430');
/*!40000 ALTER TABLE `diagnosticos_iniciales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios_catalogo`
--

DROP TABLE IF EXISTS `ejercicios_catalogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios_catalogo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` enum('ESPALDA_BICEPS','PECHO_TRICEPS','PIERNA','CORE','POSTURA_CUELLO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_tecnica` text COLLATE utf8mb4_unicode_ci,
  `es_postural` tinyint(1) NOT NULL DEFAULT '0',
  `video_o_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios_catalogo`
--

LOCK TABLES `ejercicios_catalogo` WRITE;
/*!40000 ALTER TABLE `ejercicios_catalogo` DISABLE KEYS */;
INSERT INTO `ejercicios_catalogo` VALUES (1,'Dominadas Pronas (Pull-ups)','ESPALDA_BICEPS','Agarre prono al ancho de hombros. Tracción explosiva llevando la barbilla sobre la barra, retrayendo escápulas.',0,NULL),(2,'Fondos en Paralelas / Silla','PECHO_TRICEPS','Descenso controlado a 90 grados, torso ligeramente inclinado al frente para enfatizar pectoral inferior.',0,NULL),(3,'Flexiones Declinadas con Pies Elevados','PECHO_TRICEPS','Pies sobre cama o silla. Enfoque en haz clavicular del pectoral superior y deltoides anterior.',0,NULL),(4,'Sentadillas Búlgaras (Pies alternados)','PIERNA','Un pie apoyado atrás, descenso vertical manteniendo rodilla alineada con la punta del pie.',0,NULL),(5,'Elevación de Piernas Colgado en Barra','CORE','Colgado de la barra, elevar piernas o rodillas contrayendo recto abdominal sin balancear la espalda baja.',0,NULL),(6,'Retracción Escapular y Face Pulls en Banda','POSTURA_CUELLO','Tracción a la altura de la frente con rotación externa para fortalecer romboides y trapecio medio.',1,NULL),(7,'Chin Tucks (Doble mentón isométrico)','POSTURA_CUELLO','Retracción cervical recta contra la pared. Activa flexores profundos del cuello contra el text neck.',1,NULL);
/*!40000 ALTER TABLE `ejercicios_catalogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_bloques`
--

DROP TABLE IF EXISTS `horarios_bloques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios_bloques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `dia_semana` enum('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `franja_horaria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actividad` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_dia` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  PRIMARY KEY (`id`),
  KEY `horarios_bloques_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `horarios_bloques_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_bloques`
--

LOCK TABLES `horarios_bloques` WRITE;
/*!40000 ALTER TABLE `horarios_bloques` DISABLE KEYS */;
INSERT INTO `horarios_bloques` VALUES (16,1,'LUNES','05:50 - 06:15','Despertar + 500ml Agua + Skincare AM','TIPO_A','RUTINA_MANANA'),(17,1,'LUNES','06:40 - 08:25','Traslado al trabajo AV (podcasts técnicos o descanso)','TIPO_A','TRANSPORTE'),(18,1,'LUNES','08:30 - 13:00','Trabajo Técnico de Integraciones AV','TIPO_A','TRABAJO'),(19,1,'LUNES','13:00 - 14:00','Almuerzo casero + caminata postural 10m','TIPO_A','ALMUERZO'),(20,1,'LUNES','14:00 - 17:30','Trabajo Técnico de Integraciones AV','TIPO_A','TRABAJO'),(21,1,'LUNES','17:30 - 19:25','Retorno a casa (Metropolitano/Buses)','TIPO_A','TRANSPORTE'),(22,1,'LUNES','19:30 - 22:30','Clases Universidad Ing. Sistemas (3 bloques)','TIPO_A','UNIVERSIDAD'),(23,1,'LUNES','22:30 - 22:50','Skincare PM + Chin Tucks cervicales','TIPO_A','RUTINA_NOCHE'),(24,1,'LUNES','22:50 - 05:50','Ancla de Sueño Sagrada (7 Horas)','TIPO_A','SUENO'),(25,1,'MARTES','05:50 - 06:15','Despertar + Agua + Skincare AM','TIPO_B','RUTINA_MANANA'),(26,1,'MARTES','08:30 - 17:30','Trabajo Técnico de Integraciones AV','TIPO_B','TRABAJO'),(27,1,'MARTES','19:30 - 20:20','Calistenia en Barra: Torso A (Dominadas/Fondos)','TIPO_B','ENTRENAMIENTO'),(28,1,'MARTES','20:20 - 21:00','Ducha + Cena alta en proteína','TIPO_B','NUTRICION'),(29,1,'MARTES','21:00 - 22:30','Estudio Crestron / Proyectos / Hobbies','TIPO_B','ESTUDIO'),(30,1,'MARTES','22:50 - 05:50','Ancla de Sueño Sagrada (7 Horas)','TIPO_B','SUENO');
/*!40000 ALTER TABLE `horarios_bloques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ideas_dibujo`
--

DROP TABLE IF EXISTS `ideas_dibujo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ideas_dibujo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ANATOMIA',
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `referencia_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dificultad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIO',
  `completada` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_creacion` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ideas_dibujo_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `ideas_dibujo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas_dibujo`
--

LOCK TABLES `ideas_dibujo` WRITE;
/*!40000 ALTER TABLE `ideas_dibujo` DISABLE KEYS */;
INSERT INTO `ideas_dibujo` VALUES (6,1,'Estudio Anatómico de Torso y Escápulas en V','ANATOMIA','Dibujar la estructura ósea y muscular: clavículas, caja torácica, dorsal ancho y serratos en vista frontal y posterior.',NULL,'MEDIO',0,'2026-10-01 21:38:08.510'),(7,1,'Construcción de Manos en Cajas 3D y Perspectiva','MANOS','Dibujar la palma como una cuña 3D y articular los nudillos con cilindros para dedos en 5 poses cotidianas.',NULL,'MEDIO',0,'2026-10-01 21:38:08.514'),(8,1,'Líneas de Acción y Gesto Dinámico (Poses de 60 segundos)','GESTO','Capturar el movimiento y la energía de una figura con una sola curva de acción sin entrar en detalles musculares.',NULL,'FACIL',1,'2026-10-01 21:38:08.518'),(9,1,'Diseño de Personaje Estilo Manhwa / Webtoon','PERSONAJES_MANHWA','Silueta estilizada, mirada expresiva, cabello con mechones principales e iluminación de alto contraste.',NULL,'AVANZADO',0,'2026-10-01 21:38:08.521'),(10,1,'Estudio de Cabeza en Método Loomis (Ángulo 3/4)','ANATOMIA','Esfera con cortes laterales, cruz facial para ojos y nariz, y alineación de orejas con el arco cigomático.',NULL,'MEDIO',0,'2026-10-01 21:38:08.524');
/*!40000 ALTER TABLE `ideas_dibujo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insights_ia`
--

DROP TABLE IF EXISTS `insights_ia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insights_ia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `modulo` enum('FINANZAS','FITNESS','HABITOS_SUENO','METAS','DIBUJO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `diagnostico` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `recomendaciones_json` json NOT NULL,
  `fecha_generacion` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `aplicado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `insights_ia_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `insights_ia_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insights_ia`
--

LOCK TABLES `insights_ia` WRITE;
/*!40000 ALTER TABLE `insights_ia` DISABLE KEYS */;
INSERT INTO `insights_ia` VALUES (1,1,'FITNESS','Brayan, tu enfoque en ganar masa muscular en \'V\' y corregir el síndrome cruzado superior es ambicioso y alcanzable. Sin datos de tu rendimiento actual, nuestra primera sesión se centrará en establecer una línea base de fuerza y técnica para tus dominadas, esenciales para tu desarrollo.','{\"diagnostico\": \"Brayan, tu enfoque en ganar masa muscular en \'V\' y corregir el síndrome cruzado superior es ambicioso y alcanzable. Sin datos de tu rendimiento actual, nuestra primera sesión se centrará en establecer una línea base de fuerza y técnica para tus dominadas, esenciales para tu desarrollo.\", \"metaSemanal\": \"Lograr ejecutar 7 dominadas estrictas sin balanceo en tu primera serie, manteniendo la forma perfecta y la retracción escapular, y completar las 3 series de flexiones con técnica impecable.\", \"alertaPostural\": \"Tu cuello adelantado y hombros redondeados por el trabajo en laptop requieren intervención constante. Realiza 10-15 repeticiones de \'Chin Tucks\' y 10-15 retracciones escapulares (apretando omóplatos hacia abajo y atrás) cada 2-3 horas, especialmente durante tu jornada laboral.\", \"progresionSugerida\": \"Para dominadas: 3 series de 6-8 repeticiones estrictas con una pausa de 1 segundo en la cima y control en la bajada. Para un balance muscular y dado tu equipamiento, sustituiremos fondos por 3 series de 10-15 flexiones (push-ups) estrictas, manteniendo el cuerpo recto y hombros deprimidos.\", \"consejoRecuperacion\": \"Prioriza 7-9 horas de sueño reparador cada noche. Asegura una ingesta alta de proteína casera en cada comida: opta por pechuga de pollo, huevos, legumbres y lácteos magros para optimizar la reparación muscular y la hipertrofia.\", \"rutinaCorrectivaMinutos\": 5}','2026-09-29 15:30:58.215',0),(2,1,'FITNESS','Brayan presenta un gran potencial para la ganancia muscular en \'V\', pero la falta de historial de entrenamiento exige el establecimiento de una base de fuerza en movimientos clave. Su postura, con un síndrome cruzado superior pronunciado por el trabajo en laptop, es una prioridad crítica a corregir para su salud y progresión.','{\"diagnostico\": \"Brayan presenta un gran potencial para la ganancia muscular en \'V\', pero la falta de historial de entrenamiento exige el establecimiento de una base de fuerza en movimientos clave. Su postura, con un síndrome cruzado superior pronunciado por el trabajo en laptop, es una prioridad crítica a corregir para su salud y progresión.\", \"metaSemanal\": \"Alcanzar 6 dominadas estrictas con técnica impecable en la primera serie, y realizar los \'Chin Tucks\' y retracciones escapulares al menos 3 veces al día, sintiendo una mayor alineación cervical.\", \"alertaPostural\": \"Es IMPRESCINDIBLE integrar los \'Chin Tucks\' para corregir el cuello adelantado, realizándolos con movimientos lentos y controlados, y las retracciones escapulares para llevar los hombros a su posición natural. Mantén una conciencia postural constante frente a la laptop, ajustando la pantalla y tu silla.\", \"progresionSugerida\": \"Para la siguiente sesión, concéntrate en 3 series de 5-8 Dominadas Estrictas con Pausa de 1 segundo en la parte superior (escápulas retraídas y deprimidas) y un descenso controlado de 3 segundos. Si no puedes completar 5 reps, realiza Negativas lentas (3-5 segundos de descenso) por 3 series de 5-8 repeticiones.\", \"consejoRecuperacion\": \"Prioriza 7-9 horas de sueño ininterrumpido cada noche para maximizar la recuperación y el crecimiento muscular. Para el objetivo de 75kg, aumenta tu ingesta de proteína magra (pollo, pescado, huevos, lentejas) en cada comida, utilizando preparaciones caseras nutritivas para optimizar la síntesis proteica.\", \"rutinaCorrectivaMinutos\": 10}','2026-10-01 21:31:59.656',0);
/*!40000 ALTER TABLE `insights_ia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metas`
--

DROP TABLE IF EXISTS `metas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `titulo` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `categoria` enum('FINANZAS','FITNESS','POSTURA','SKINCARE','CARRERA','DIBUJO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FINANZAS',
  `horizonte` enum('CORTO_1_3M','MEDIANO_3_6M','LARGO_1_3A') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CORTO_1_3M',
  `monto_objetivo` decimal(10,2) DEFAULT NULL,
  `monto_acumulado` decimal(10,2) NOT NULL DEFAULT '0.00',
  `fecha_limite` datetime(3) DEFAULT NULL,
  `estado` enum('PENDIENTE','EN_PROGRESO','COMPLETADA','PAUSADA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN_PROGRESO',
  `prioridad` int NOT NULL DEFAULT '1',
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `metas_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `metas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metas`
--

LOCK TABLES `metas` WRITE;
/*!40000 ALTER TABLE `metas` DISABLE KEYS */;
INSERT INTO `metas` VALUES (1,1,'Fondo de Emergencia Inicial (1 Mes de Sueldo)','Tener S/ 1,500 guardados para imprevistos sin depender de deudas.','FINANZAS','MEDIANO_3_6M',1500.00,700.00,'2026-12-28 05:58:00.552','EN_PROGRESO',1,'2026-09-29 05:58:00.553','2026-10-02 03:52:56.240'),(4,1,'Dominar 10 Dominadas Pronas Estrictas','Completar 3 series de 10 dominadas en barra fija sin balanceo ni impulso.','FITNESS','CORTO_1_3M',NULL,0.00,'2026-11-28 05:58:00.552','EN_PROGRESO',1,'2026-09-29 05:58:00.579','2026-09-29 05:58:00.579'),(5,1,'30 Días Consecutivos Durmiendo 7 Horas (22:50 - 05:50)','Proteger la ancla sagrada del sueño para eliminar ojeras y fatiga cognitiva.','FITNESS','CORTO_1_3M',NULL,0.00,'2026-10-29 05:58:00.552','EN_PROGRESO',2,'2026-09-29 05:58:00.589','2026-09-29 05:58:00.589');
/*!40000 ALTER TABLE `metas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practicas_dibujo`
--

DROP TABLE IF EXISTS `practicas_dibujo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practicas_dibujo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `minutos` int NOT NULL DEFAULT '30',
  `enfoque` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calificacion` int NOT NULL DEFAULT '7',
  `notas` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `practicas_dibujo_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `practicas_dibujo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practicas_dibujo`
--

LOCK TABLES `practicas_dibujo` WRITE;
/*!40000 ALTER TABLE `practicas_dibujo` DISABLE KEYS */;
INSERT INTO `practicas_dibujo` VALUES (1,1,'2026-10-01 21:37:44.839',35,'Líneas de acción, elipses y estructura básica de torso',8,'Buena fluidez en trazos iniciales. Seguir practicando proporción de caja torácica vs pelvis.'),(2,1,'2026-10-01 21:38:08.527',35,'Líneas de acción, elipses y estructura básica de torso',8,'Buena fluidez en trazos iniciales. Seguir practicando proporción de caja torácica vs pelvis.');
/*!40000 ALTER TABLE `practicas_dibujo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuestos_mensuales`
--

DROP TABLE IF EXISTS `presupuestos_mensuales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuestos_mensuales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `anio` int NOT NULL,
  `mes` int NOT NULL,
  `ingreso_total` decimal(10,2) NOT NULL DEFAULT '1500.00',
  `fijo_apoyo_casa` decimal(10,2) NOT NULL DEFAULT '500.00',
  `fijo_movil` decimal(10,2) NOT NULL DEFAULT '28.00',
  `fijo_transporte` decimal(10,2) NOT NULL DEFAULT '120.00',
  `meta_ahorro_mes` decimal(10,2) NOT NULL DEFAULT '200.00',
  `presupuesto_variable_max` decimal(10,2) NOT NULL DEFAULT '652.00',
  `cerrado` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `presupuestos_mensuales_anio_mes_key` (`anio`,`mes`),
  KEY `presupuestos_mensuales_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `presupuestos_mensuales_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuestos_mensuales`
--

LOCK TABLES `presupuestos_mensuales` WRITE;
/*!40000 ALTER TABLE `presupuestos_mensuales` DISABLE KEYS */;
INSERT INTO `presupuestos_mensuales` VALUES (1,1,2026,9,1500.00,500.00,28.00,120.00,200.00,652.00,0,'2026-09-29 05:58:00.528','2026-09-29 05:58:00.528'),(2,1,2026,10,1500.00,500.00,28.00,120.00,200.00,652.00,0,'2026-10-01 21:27:42.437','2026-10-01 21:27:42.437');
/*!40000 ALTER TABLE `presupuestos_mensuales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_skincare`
--

DROP TABLE IF EXISTS `productos_skincare`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_skincare` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marca` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paso_numero` int NOT NULL DEFAULT '1',
  `momento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AM_PM',
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HIDRATANTE',
  `en_uso` tinyint(1) NOT NULL DEFAULT '1',
  `precio` decimal(10,2) DEFAULT NULL,
  `instrucciones` text COLLATE utf8mb4_unicode_ci,
  `notas` text COLLATE utf8mb4_unicode_ci,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `productos_skincare_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `productos_skincare_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_skincare`
--

LOCK TABLES `productos_skincare` WRITE;
/*!40000 ALTER TABLE `productos_skincare` DISABLE KEYS */;
INSERT INTO `productos_skincare` VALUES (6,1,'Gel Multifacción Control Brillo','Totalist',2,'AM_PM','HIDRATANTE',1,42.00,'','','2026-10-01 21:38:08.496');
/*!40000 ALTER TABLE `productos_skincare` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros_entrenamiento`
--

DROP TABLE IF EXISTS `registros_entrenamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_entrenamiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `rutina_id` int NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `duracion_minutos` int NOT NULL DEFAULT '45',
  `rpe_esfuerzo_general` int NOT NULL DEFAULT '7',
  `molestia_cuello` int NOT NULL DEFAULT '0',
  `comentarios` text COLLATE utf8mb4_unicode_ci,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `registros_entrenamiento_usuario_id_fkey` (`usuario_id`),
  KEY `registros_entrenamiento_rutina_id_fkey` (`rutina_id`),
  CONSTRAINT `registros_entrenamiento_rutina_id_fkey` FOREIGN KEY (`rutina_id`) REFERENCES `rutinas_ejercicio` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `registros_entrenamiento_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_entrenamiento`
--

LOCK TABLES `registros_entrenamiento` WRITE;
/*!40000 ALTER TABLE `registros_entrenamiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `registros_entrenamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros_habitos_diarios`
--

DROP TABLE IF EXISTS `registros_habitos_diarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_habitos_diarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL DEFAULT '1',
  `fecha` date NOT NULL,
  `litros_agua` decimal(3,1) NOT NULL DEFAULT '0.0',
  `skincare_am` tinyint(1) NOT NULL DEFAULT '0',
  `skincare_pm` tinyint(1) NOT NULL DEFAULT '0',
  `horas_sueno` decimal(3,1) NOT NULL DEFAULT '0.0',
  `calidad_sueno` int DEFAULT NULL,
  `pausas_postura` int NOT NULL DEFAULT '0',
  `minutos_redes` int NOT NULL DEFAULT '0',
  `notas` text COLLATE utf8mb4_unicode_ci,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registros_habitos_diarios_fecha_key` (`fecha`),
  KEY `registros_habitos_diarios_usuario_id_fkey` (`usuario_id`),
  CONSTRAINT `registros_habitos_diarios_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_habitos_diarios`
--

LOCK TABLES `registros_habitos_diarios` WRITE;
/*!40000 ALTER TABLE `registros_habitos_diarios` DISABLE KEYS */;
INSERT INTO `registros_habitos_diarios` VALUES (1,1,'2026-09-29',1.5,1,0,7.0,8,2,25,'Buen nivel de energía tras dormir a las 22:50.','2026-09-29 05:58:00.693','2026-09-29 05:58:00.693'),(2,1,'2026-10-01',0.0,0,0,7.0,7,0,0,NULL,'2026-10-01 21:27:42.440','2026-10-01 21:27:42.440'),(3,1,'2026-10-02',0.5,0,0,8.0,7,0,0,NULL,'2026-10-02 03:31:29.255','2026-10-02 03:47:58.253'),(4,1,'2026-10-03',2.0,1,0,7.0,7,2,0,NULL,'2026-10-03 02:05:45.037','2026-10-03 02:07:00.075'),(5,1,'2026-10-04',1.3,0,0,7.0,7,0,0,NULL,'2026-10-04 04:12:58.172','2026-10-04 04:19:28.507'),(6,1,'2026-10-06',2.0,0,0,7.0,7,0,0,NULL,'2026-10-06 02:58:05.456','2026-10-06 03:00:52.854');
/*!40000 ALTER TABLE `registros_habitos_diarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutinas_ejercicio`
--

DROP TABLE IF EXISTS `rutinas_ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutinas_ejercicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_sugerido` enum('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_dia_tipo_b` tinyint(1) NOT NULL DEFAULT '1',
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rutinas_ejercicio_codigo_key` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutinas_ejercicio`
--

LOCK TABLES `rutinas_ejercicio` WRITE;
/*!40000 ALTER TABLE `rutinas_ejercicio` DISABLE KEYS */;
INSERT INTO `rutinas_ejercicio` VALUES (1,'TORSO_A','Torso A: Dominadas, Fondos y Postura','MARTES',1,'Rutina principal de fuerza para tren superior en barra. Enfoque en espalda en V y pecho.'),(2,'PIERNA_CORE','Pierna & Core: Sentadilla Búlgara y Abdomen','JUEVES',1,'Pierna unilateral con peso corporal + control del core y estabilidad lumbar.'),(3,'FULL_BODY_SABADO','Full Body: Potencia y Retracción Postural','SABADO',1,'Sesión integral de fin de semana para consolidar volumen de calistenia y descompresión.');
/*!40000 ALTER TABLE `rutinas_ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series_entrenamiento`
--

DROP TABLE IF EXISTS `series_entrenamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `series_entrenamiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registro_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `numero_serie` int NOT NULL,
  `repeticiones` int NOT NULL,
  `peso_lastre_kg` decimal(5,2) NOT NULL DEFAULT '0.00',
  `rpe_serie` int DEFAULT NULL,
  `fallo_muscular` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `series_entrenamiento_registro_id_fkey` (`registro_id`),
  KEY `series_entrenamiento_ejercicio_id_fkey` (`ejercicio_id`),
  CONSTRAINT `series_entrenamiento_ejercicio_id_fkey` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios_catalogo` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `series_entrenamiento_registro_id_fkey` FOREIGN KEY (`registro_id`) REFERENCES `registros_entrenamiento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series_entrenamiento`
--

LOCK TABLES `series_entrenamiento` WRITE;
/*!40000 ALTER TABLE `series_entrenamiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `series_entrenamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacciones`
--

DROP TABLE IF EXISTS `transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `presupuesto_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `tipo` enum('INGRESO','GASTO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GASTO',
  `monto` decimal(10,2) NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metodo_pago` enum('YAPE_PLIN','EFECTIVO','TRANSFERENCIA','TARJETA_DEBITO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'YAPE_PLIN',
  `es_gasto_hormiga` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `transacciones_fecha_idx` (`fecha`),
  KEY `transacciones_presupuesto_id_fkey` (`presupuesto_id`),
  KEY `transacciones_categoria_id_fkey` (`categoria_id`),
  CONSTRAINT `transacciones_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_finanzas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transacciones_presupuesto_id_fkey` FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos_mensuales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones`
--

LOCK TABLES `transacciones` WRITE;
/*!40000 ALTER TABLE `transacciones` DISABLE KEYS */;
INSERT INTO `transacciones` VALUES (1,1,9,'INGRESO',1500.00,'2026-09-29 05:58:00.546','Pago quincena / sueldo mensual Técnico AV','TRANSFERENCIA',0,'2026-09-29 05:58:00.546'),(2,1,7,'GASTO',500.00,'2026-09-29 05:58:00.546','Aporte mensual obligatorio para el hogar','TRANSFERENCIA',0,'2026-09-29 05:58:00.546'),(3,1,7,'GASTO',25.00,'2026-09-29 05:58:00.546','Recarga tarjeta de transporte semanal','EFECTIVO',0,'2026-09-29 05:58:00.546'),(4,1,7,'GASTO',32.50,'2026-09-29 05:58:00.546','Compra huevos y atún para cena alta en proteína','YAPE_PLIN',0,'2026-09-29 05:58:00.546'),(5,1,7,'GASTO',4.50,'2026-09-29 05:58:00.546','Gaseosa y galleta en paradero (Gasto Hormiga)','EFECTIVO',1,'2026-09-29 05:58:00.546'),(6,2,7,'GASTO',50.00,'2026-10-02 03:52:54.760','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:54.760'),(7,2,7,'GASTO',50.00,'2026-10-02 03:52:54.982','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:54.982'),(8,2,7,'GASTO',50.00,'2026-10-02 03:52:55.144','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:55.144'),(9,2,7,'GASTO',50.00,'2026-10-02 03:52:55.527','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:55.527'),(10,2,7,'GASTO',50.00,'2026-10-02 03:52:55.717','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:55.717'),(11,2,7,'GASTO',50.00,'2026-10-02 03:52:55.882','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:55.882'),(12,2,7,'GASTO',50.00,'2026-10-02 03:52:56.045','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:56.045'),(13,2,7,'GASTO',50.00,'2026-10-02 03:52:56.233','Aporte a meta: Fondo de Emergencia Inicial (1 Mes de Sueldo)','TRANSFERENCIA',0,'2026-10-02 03:52:56.233'),(14,2,19,'GASTO',450.00,'2026-10-02 04:24:05.404','Gasto casa','YAPE_PLIN',0,'2026-10-02 04:24:05.406'),(15,2,12,'GASTO',8.20,'2026-10-04 04:14:55.519','Desayuno','YAPE_PLIN',1,'2026-10-04 04:14:55.523'),(16,2,11,'GASTO',21.90,'2026-10-04 04:15:52.237','Almuerzo','YAPE_PLIN',0,'2026-10-04 04:15:52.240'),(17,2,11,'GASTO',21.00,'2026-10-04 04:16:06.003','Cena','YAPE_PLIN',0,'2026-10-04 04:16:06.005'),(18,2,12,'GASTO',4.20,'2026-10-04 04:18:13.418','Merienda','YAPE_PLIN',1,'2026-10-04 04:18:13.424'),(19,2,7,'GASTO',20.00,'2026-10-06 02:59:32.385','Corte de cabello','YAPE_PLIN',0,'2026-10-06 02:59:32.388'),(20,2,7,'GASTO',18.30,'2026-10-06 03:00:11.207','Transporte','YAPE_PLIN',0,'2026-10-06 03:00:11.209');
/*!40000 ALTER TABLE `transacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Brayan',
  `alias` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Bry',
  `edad` int NOT NULL DEFAULT '22',
  `peso_actual_kg` decimal(5,2) NOT NULL DEFAULT '70.00',
  `peso_meta_kg` decimal(5,2) NOT NULL DEFAULT '75.50',
  `estatura_cm` int NOT NULL DEFAULT '180',
  `porcentaje_grasa` decimal(4,2) NOT NULL DEFAULT '15.50',
  `sueldo_base` decimal(10,2) NOT NULL DEFAULT '1500.00',
  `meta_horas_sueno` decimal(3,1) NOT NULL DEFAULT '7.0',
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  `anti_metas` text COLLATE utf8mb4_unicode_ci,
  `digestion` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dinero_actual_caja` decimal(10,2) NOT NULL DEFAULT '0.00',
  `filosofia` text COLLATE utf8mb4_unicode_ci,
  `horario_laboral` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ocupacion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postura_detalle` text COLLATE utf8mb4_unicode_ci,
  `tipo_cabello` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_piel` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vello_facial` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ahorro_blindado` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Brayan','Bry',22,70.00,75.50,180,15.50,1500.00,7.0,'2026-09-29 05:58:00.421','2026-10-06 03:00:11.215','Cero procrastinación nocturna en redes sociales, erradicar gastos hormiga no planificados y proteger las 7 horas sagradas de sueño.','Regular, intolerancia leve a leche entera',3283.26,'Mejorar habilidades en trabajo técnico AV, culminar carrera de sistemas y forjar un físico atlético en V con disciplina estoica.','Lunes a Sábado de 8:30 am a 5:30 pm (Sábados jornada corta ~1:00 pm)','Técnico de Integración AV (Crestron SIMPL/Construct, Q-SYS, Extron) / Estudiante de 9no ciclo de Ing. de Sistemas','Síndrome cruzado superior: cuello adelantado (text neck), cifosis torácica leve y hombros rotados al frente','Ondulado (2A/2B) | Cuero cabelludo graso (<24h), puntas secas','Mixta / Reactiva (exceso de sebo en zona T, barrera cutánea en recuperación)','Barba dispersa / irregular. Irritación al rasurar con rastrillo común',700.00);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05 22:03:18
