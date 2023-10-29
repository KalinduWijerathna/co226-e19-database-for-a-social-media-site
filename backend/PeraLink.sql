-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 02, 2023 at 07:21 AM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `peralink`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_time` time NOT NULL,
  `c_date` int(11) NOT NULL,
  `c_month` int(11) NOT NULL,
  `c_year` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_bin NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`c_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`c_id`, `c_time`, `c_date`, `c_month`, `c_year`, `content`, `user_id`, `post_id`) VALUES
(1, '12:30:00', 1, 1, 2023, 'Nice post!', 2, 1),
(2, '09:30:00', 2, 2, 2023, 'Good morning, Jane!', 1, 1),
(3, '10:00:00', 2, 2, 2023, 'Have a great day!', 3, 1),
(4, '15:00:00', 3, 3, 2023, 'Hello John!', 2, 2),
(5, '16:30:00', 4, 4, 2023, 'Nice post, Alice!', 4, 3),
(6, '11:45:00', 5, 5, 2023, 'Feeling excited too!', 5, 4),
(7, '12:00:00', 5, 5, 2023, 'Same here!', 6, 4),
(8, '17:15:00', 6, 6, 2023, 'Just relaxing...', 3, 5),
(9, '18:00:00', 6, 6, 2023, 'Enjoy your weekend!', 7, 5),
(10, '20:20:00', 7, 7, 2023, 'Looking forward to it!', 8, 6),
(11, '13:10:00', 8, 8, 2023, 'Sounds fun!', 9, 7);

-- --------------------------------------------------------

--
-- Table structure for table `comment_like`
--

DROP TABLE IF EXISTS `comment_like`;
CREATE TABLE IF NOT EXISTS `comment_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `l_time` time NOT NULL,
  `l_date` int(11) NOT NULL,
  `l_month` int(11) NOT NULL,
  `l_year` year(4) NOT NULL,
  `liketype_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `comment_id` (`comment_id`),
  KEY `liketype_id` (`liketype_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `comment_like`
--

INSERT INTO `comment_like` (`id`, `l_time`, `l_date`, `l_month`, `l_year`, `liketype_id`, `user_id`, `comment_id`) VALUES
(1, '12:30:00', 1, 1, 2023, 1, 2, 1),
(2, '12:30:00', 1, 1, 2023, 1, 2, 1),
(3, '09:50:00', 2, 2, 2023, 1, 1, 1),
(4, '10:30:00', 2, 2, 2023, 2, 3, 1),
(5, '15:45:00', 3, 3, 2023, 1, 2, 2),
(6, '17:00:00', 4, 4, 2023, 3, 4, 3),
(7, '11:55:00', 5, 5, 2023, 1, 5, 4),
(8, '12:30:00', 5, 5, 2023, 2, 6, 4),
(9, '17:45:00', 6, 6, 2023, 1, 3, 5),
(10, '18:30:00', 6, 6, 2023, 2, 7, 5),
(11, '20:40:00', 7, 7, 2023, 1, 8, 6),
(12, '13:30:00', 8, 8, 2023, 2, 9, 7);

-- --------------------------------------------------------

--
-- Table structure for table `friends_with`
--

DROP TABLE IF EXISTS `friends_with`;
CREATE TABLE IF NOT EXISTS `friends_with` (
  `friend_id` int(11) NOT NULL AUTO_INCREMENT,
  `accepter_id` int(11) NOT NULL,
  `requester_id` int(11) NOT NULL,
  `acc_date` date NOT NULL,
  PRIMARY KEY (`friend_id`),
  KEY `requester_id` (`requester_id`),
  KEY `accepter_id` (`accepter_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `friends_with`
--

INSERT INTO `friends_with` (`friend_id`, `accepter_id`, `requester_id`, `acc_date`) VALUES
(1, 3, 1, '2023-02-05'),
(2, 4, 2, '2023-03-10'),
(3, 5, 3, '2023-04-15'),
(4, 6, 4, '2023-05-20'),
(5, 7, 5, '2023-06-25'),
(6, 8, 6, '2023-07-30'),
(7, 9, 7, '2023-08-04'),
(8, 10, 8, '2023-09-09'),
(9, 1, 9, '2023-10-14'),
(10, 2, 10, '2023-11-19');

-- --------------------------------------------------------

--
-- Table structure for table `friend_request`
--

DROP TABLE IF EXISTS `friend_request`;
CREATE TABLE IF NOT EXISTS `friend_request` (
  `requestee_id` int(11) NOT NULL,
  `requester_id` int(11) NOT NULL,
  `req_time` time NOT NULL,
  `req_date` date NOT NULL,
  `req_status` varchar(25) COLLATE utf8mb4_bin NOT NULL,
  KEY `requestee_id` (`requestee_id`),
  KEY `requester_id` (`requester_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `like_type`
--

DROP TABLE IF EXISTS `like_type`;
CREATE TABLE IF NOT EXISTS `like_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `type_emoji` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `like_type`
--

INSERT INTO `like_type` (`type_id`, `type_name`, `type_emoji`) VALUES
(1, 'Like', '👍'),
(2, 'Love', '❤️'),
(3, 'Haha', '😄'),
(4, 'Wow', '😲'),
(5, 'Sad', '😢'),
(6, 'Angry', '😡');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `p_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_title` varchar(255) NULL,
  `p_time` time NOT NULL,
  `p_date` int(11) NOT NULL,
  `p_month` int(11) NOT NULL,
  `p_year` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_bin NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`p_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`p_id`, `p_time`, `p_date`, `p_month`, `p_year`, `content`, `user_id`) VALUES
(1, '12:00:00', 1, 1, 2023, 'Hello world!', 1),
(2, '09:00:00', 2, 2, 2023, 'Good morning!', 2),
(3, '14:30:00', 3, 3, 2023, 'Hello everyone!', 1),
(4, '18:45:00', 4, 4, 2023, 'I had a great day!', 3),
(5, '20:15:00', 5, 5, 2023, 'Feeling excited!', 4),
(6, '11:20:00', 6, 6, 2023, 'Just chilling...', 2),
(7, '16:10:00', 7, 7, 2023, 'Enjoying the weekend!', 1),
(8, '19:30:00', 8, 8, 2023, 'Having fun with friends!', 5),
(9, '21:45:00', 9, 9, 2023, 'Looking forward to the future!', 6),
(10, '10:05:00', 10, 10, 2023, 'New beginnings!', 7),
(11, '15:50:00', 11, 11, 2023, 'Feeling blessed!', 8);

-- --------------------------------------------------------

--
-- Table structure for table `post_like`
--

DROP TABLE IF EXISTS `post_like`;
CREATE TABLE IF NOT EXISTS `post_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `l_time` time NOT NULL,
  `l_date` int(11) NOT NULL,
  `l_month` int(11) NOT NULL,
  `l_year` year(4) NOT NULL,
  `liketype_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `post_like`
--

INSERT INTO `post_like` (`id`, `l_time`, `l_date`, `l_month`, `l_year`, `liketype_id`, `user_id`, `post_id`) VALUES
(1, '12:30:00', 1, 1, 2023, 1, 2, 1),
(2, '12:30:00', 1, 1, 2023, 1, 2, 1),
(3, '09:40:00', 2, 2, 2023, 1, 1, 1),
(4, '10:15:00', 2, 2, 2023, 2, 3, 1),
(5, '15:30:00', 3, 3, 2023, 1, 2, 2),
(6, '16:45:00', 4, 4, 2023, 3, 4, 3),
(7, '11:50:00', 5, 5, 2023, 1, 5, 4),
(8, '12:15:00', 5, 5, 2023, 2, 6, 4),
(9, '17:30:00', 6, 6, 2023, 1, 3, 5),
(10, '18:20:00', 6, 6, 2023, 2, 7, 5),
(11, '20:30:00', 7, 7, 2023, 1, 8, 6),
(12, '13:20:00', 8, 8, 2023, 2, 9, 7);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `u_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `sex` tinyint(4) DEFAULT NULL,
  `b_year` year(4) DEFAULT NULL,
  `b_month` int(11) DEFAULT NULL,
  `b_date` int(11) DEFAULT NULL,
  `profile_picture` text DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `affiliation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `bio` text COLLATE utf8mb4_bin DEFAULT NULL,
  `interest` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`u_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`u_id`, `user_name`, `password`, `first_name`, `last_name`, `email`, `sex`, `b_year`, `b_month`, `b_date`, `profile_picture`, `location`, `affiliation`, `bio`, `interest`) VALUES
(1, 'john_doe', 'password123', 'John', 'Doe', 'john.doe@example.com', 1, 1990, 1, 1, NULL, NULL, NULL, 'I am John Doe.', NULL),
(2, 'jane_smith', 'password456', 'Jane', 'Smith', 'jane.smith@example.com', 0, 1992, 3, 15, NULL, NULL, NULL, 'I am Jane Smith.', NULL),
(3, 'alice', 'password789', 'Alice', 'Johnson', 'alice@example.com', 0, 1995, 6, 12, NULL, NULL, NULL, 'I am Alice Johnson.', NULL),
(4, 'bob', 'password321', 'Bob', 'Smith', 'bob@example.com', 1, 1993, 9, 25, NULL, NULL, NULL, 'I am Bob Smith.', NULL),
(5, 'emma', 'password654', 'Emma', 'Davis', 'emma@example.com', 0, 1998, 2, 7, NULL, NULL, NULL, 'I am Emma Davis.', NULL),
(6, 'michael', 'password987', 'Michael', 'Wilson', 'michael@example.com', 1, 1991, 12, 3, NULL, NULL, NULL, 'I am Michael Wilson.', NULL),
(7, 'sophia', 'password012', 'Sophia', 'Brown', 'sophia@example.com', 0, 1997, 4, 18, NULL, NULL, NULL, 'I am Sophia Brown.', NULL),
(8, 'david', 'password345', 'David', 'Lee', 'david@example.com', 1, 1994, 7, 9, NULL, NULL, NULL, 'I am David Lee.', NULL),
(9, 'olivia', 'password678', 'Olivia', 'Miller', 'olivia@example.com', 0, 1996, 10, 27, NULL, NULL, NULL, 'I am Olivia Miller.', NULL),
(10, 'james', 'password901', 'James', 'Taylor', 'james@example.com', 1, 1992, 8, 14, NULL, NULL, NULL, 'I am James Taylor.', NULL),
(11, 'lily', 'password234', 'Lily', 'Anderson', 'lily@example.com', 0, 1999, 5, 6, NULL, NULL, NULL, 'I am Lily Anderson.', NULL),
(12, 'benjamin', 'password567', 'Benjamin', 'Clark', 'benjamin@example.com', 1, 1990, 11, 22, NULL, NULL, NULL, 'I am Benjamin Clark.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

DROP TABLE IF EXISTS `user_interests`;
CREATE TABLE IF NOT EXISTS `user_interests` (
  `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `interest` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
