-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.3.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para stocks
CREATE DATABASE IF NOT EXISTS `stocks` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;
USE `stocks`;

-- Volcando estructura para tabla stocks.contains
CREATE TABLE IF NOT EXISTS `contains` (
  `StockId` varchar(50) NOT NULL,
  `PortfolioId` int(11) NOT NULL DEFAULT 0,
  `FirstPurchaseDate` date NOT NULL,
  `AveragePurchasePrice` float NOT NULL DEFAULT 0,
  `Quantity` float NOT NULL DEFAULT 0,
  KEY `StockIdContains` (`StockId`),
  KEY `PortfolioIdContains` (`PortfolioId`),
  CONSTRAINT `PortfolioIdContains` FOREIGN KEY (`PortfolioId`) REFERENCES `portfolios` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `StockIdContains` FOREIGN KEY (`StockId`) REFERENCES `stocks` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.contains: ~2 rows (aproximadamente)
INSERT INTO `contains` (`StockId`, `PortfolioId`, `FirstPurchaseDate`, `AveragePurchasePrice`, `Quantity`) VALUES
	('IBM', 1, '2024-05-19', 162.351, 7),
	('BTC', 1, '2024-05-19', 61685.4, 0.5);

-- Volcando estructura para tabla stocks.likes
CREATE TABLE IF NOT EXISTS `likes` (
  `StockId` varchar(50) NOT NULL,
  `UserId` int(11) NOT NULL,
  KEY `StockIdLikes` (`StockId`),
  KEY `UserIdLikes` (`UserId`),
  CONSTRAINT `StockIdLikes` FOREIGN KEY (`StockId`) REFERENCES `stocks` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `UserIdLikes` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.likes: ~4 rows (aproximadamente)
INSERT INTO `likes` (`StockId`, `UserId`) VALUES
	('BTC', 2),
	('IBM', 1),
	('IBM', 3),
	('BTC', 4);

-- Volcando estructura para tabla stocks.operations
CREATE TABLE IF NOT EXISTS `operations` (
  `PortfolioId` int(11) NOT NULL,
  `StockId` varchar(50) DEFAULT '',
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date NOT NULL,
  `StockValue` float DEFAULT 0,
  `Quantity` float DEFAULT 0,
  `OperationType` enum('BUY','SALE') NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `PortfolioIdOperation` (`PortfolioId`),
  KEY `StockIdOperation` (`StockId`),
  CONSTRAINT `PortfolioIdOperation` FOREIGN KEY (`PortfolioId`) REFERENCES `portfolios` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `StockIdOperation` FOREIGN KEY (`StockId`) REFERENCES `stocks` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.operations: ~12 rows (aproximadamente)
INSERT INTO `operations` (`PortfolioId`, `StockId`, `Id`, `Date`, `StockValue`, `Quantity`, `OperationType`) VALUES
	(1, 'IBM', 52, '2024-05-19', 181.57, 1, 'BUY'),
	(1, 'BTC', 53, '2024-05-19', 61685.4, 0.5, 'BUY'),
	(1, 'IBM', 54, '2024-05-19', 181.57, 2, 'BUY'),
	(1, 'IBM', 55, '2024-05-19', 181.57, 2, 'BUY'),
	(1, 'IBM', 56, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 57, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 58, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 59, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 60, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 61, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 62, '2024-05-19', 161.57, 2, 'BUY'),
	(1, 'IBM', 63, '2024-05-19', 161.57, 2, 'BUY');

-- Volcando estructura para tabla stocks.portfolios
CREATE TABLE IF NOT EXISTS `portfolios` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `CreationDate` date DEFAULT NULL,
  `NumStocks` int(11) NOT NULL DEFAULT 0,
  `UserId` int(11) NOT NULL,
  `ShowPortfolio` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `UserIdPortfolio` (`UserId`),
  CONSTRAINT `UserIdPortfolio` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.portfolios: ~6 rows (aproximadamente)
INSERT INTO `portfolios` (`Id`, `Name`, `CreationDate`, `NumStocks`, `UserId`, `ShowPortfolio`) VALUES
	(1, 'CRYPTO', '2024-05-18', 2, 1, 0),
	(2, 'PRINCIPAL', '2024-05-18', 0, 2, 0),
	(3, 'PORTFOLIO', '2024-05-18', 0, 3, 1),
	(4, 'HOLA', '2024-05-18', 0, 2, 0),
	(5, 'SHARES', '2024-05-18', 0, 1, 0),
	(6, 'OTHER', '2024-05-18', 0, 1, 0);

-- Volcando estructura para tabla stocks.stocks
CREATE TABLE IF NOT EXISTS `stocks` (
  `Id` varchar(50) NOT NULL,
  `Type` enum('SHARES','BONDS','ETFS','CRYPTOS') NOT NULL,
  `Sector` varchar(50) DEFAULT '',
  `Name` varchar(50) NOT NULL DEFAULT '',
  `ActualPrice` float DEFAULT 0,
  `Country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.stocks: ~2 rows (aproximadamente)
INSERT INTO `stocks` (`Id`, `Type`, `Sector`, `Name`, `ActualPrice`, `Country`) VALUES
	('BTC', 'CRYPTOS', NULL, 'Bitcoin', 61685.4, NULL),
	('IBM', 'SHARES', 'TECHNOLOGY', 'International Business Machines', 161.57, 'USA');

-- Volcando estructura para tabla stocks.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` enum('INFLOW','OUTFLOW') NOT NULL,
  `Quantity` float NOT NULL,
  `Date` date NOT NULL,
  `IdUser` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserIdTransaction` (`IdUser`),
  CONSTRAINT `UserIdTransaction` FOREIGN KEY (`IdUser`) REFERENCES `users` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.transactions: ~9 rows (aproximadamente)
INSERT INTO `transactions` (`Id`, `Type`, `Quantity`, `Date`, `IdUser`) VALUES
	(77, 'INFLOW', 100, '2024-05-18', 1),
	(78, 'INFLOW', 20, '2024-05-18', 2),
	(79, 'INFLOW', 100, '2024-05-18', 3),
	(80, 'INFLOW', 200, '2024-05-18', 2),
	(81, 'OUTFLOW', -50, '2024-05-18', 1),
	(82, 'INFLOW', 20000, '2024-05-18', 2),
	(83, 'INFLOW', 100000, '2024-05-18', 3),
	(84, 'INFLOW', 100000, '2024-05-18', 1),
	(85, 'INFLOW', 20000, '2024-05-18', 2);

-- Volcando estructura para tabla stocks.users
CREATE TABLE IF NOT EXISTS `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(20) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `IBAN` varchar(24) DEFAULT NULL,
  `Email` varchar(200) DEFAULT NULL,
  `TotalInvested` float NOT NULL DEFAULT 0,
  `TotalCash` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla stocks.users: ~4 rows (aproximadamente)
INSERT INTO `users` (`Id`, `Username`, `Name`, `Surname`, `Password`, `IBAN`, `Email`, `TotalInvested`, `TotalCash`) VALUES
	(1, 'hpascual', 'Hector', 'Pascual', 'pruebaa', 'ES1202254066101426779135', 'hector.pascual.marin@gmail.com', 34335.3, 65664.7),
	(2, 'prueba1', 'Prueba', 'Uno', 'prueba1', 'ES1202254066101426879135', 'prueba@gmail.com', 0, 100000),
	(3, 'user1', 'Usuario', 'User', 'user1', 'ES3202254066101426879135', 'user1@gmail.com', 0, 100150),
	(4, 'user2', 'Hola', 'Prueba', 'contrasena', 'ES3202251066101426879135', 'user2@gmail.com', 0, 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
