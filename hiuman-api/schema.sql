-- Database Schema for HIUMAN

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `soft_identity_tag` varchar(50) DEFAULT NULL,
  `verification_status` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: personalities
CREATE TABLE IF NOT EXISTS `personalities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `mbti` varchar(10) DEFAULT NULL,
  `openness` int(11) DEFAULT 50,
  `conscientiousness` int(11) DEFAULT 50,
  `extraversion` int(11) DEFAULT 50,
  `agreeableness` int(11) DEFAULT 50,
  `emotional_stability` int(11) DEFAULT 50,
  `empathy_level` int(11) DEFAULT 50,
  `confidence` int(11) DEFAULT 50,
  `attachment_style` varchar(50) DEFAULT NULL,
  `values_alignment_score` int(11) DEFAULT 50,
  `communication_style` varchar(255) DEFAULT NULL,
  `love_languages` text DEFAULT NULL, -- JSON
  `humor_style` varchar(50) DEFAULT NULL,
  `texting_tone` varchar(50) DEFAULT NULL,
  `flirting_style` varchar(50) DEFAULT NULL,
  `energy_level` int(11) DEFAULT 50,
  `talk_preference` varchar(50) DEFAULT NULL,
  `vibe_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: matches
CREATE TABLE IF NOT EXISTS `matches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `matched_user_id` int(11) NOT NULL,
  `compatibility_score` int(11) DEFAULT 0,
  `vibe_score` int(11) DEFAULT 0,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`matched_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: circles
CREATE TABLE IF NOT EXISTS `circles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: circle_members
CREATE TABLE IF NOT EXISTS `circle_members` (
  `circle_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`circle_id`, `user_id`),
  FOREIGN KEY (`circle_id`) REFERENCES `circles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: circle_messages
CREATE TABLE IF NOT EXISTS `circle_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `circle_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`circle_id`) REFERENCES `circles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: karma_events
CREATE TABLE IF NOT EXISTS `karma_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table: vibes (logs from landing page slider)
CREATE TABLE IF NOT EXISTS `vibes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL, -- Nullable if not logged in
  `vibe_score` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Seed Data

-- Users (Password is 'password' hashed with default algo for demo purposes - replace with real hash in app logic)
-- Note: In real app use password_hash('password', PASSWORD_DEFAULT)
INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `age`, `gender`, `city`, `soft_identity_tag`, `verification_status`) VALUES
(1, 'demo@hiuman.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Demo User', 22, 'Male', 'Mumbai', 'Student', 1),
(2, 'priya@hiuman.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Priya Sharma', 21, 'Female', 'Bangalore', 'Intern', 1),
(3, 'rahul@hiuman.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Rahul Verma', 23, 'Male', 'Delhi', 'Freelancer', 1),
(4, 'sneha@hiuman.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Sneha Gupta', 22, 'Female', 'Mumbai', 'Student', 1);

-- Personalities
INSERT INTO `personalities` (`user_id`, `mbti`, `vibe_type`, `energy_level`) VALUES
(1, 'INTJ', 'mature', 40),
(2, 'ENFP', 'chaotic', 90),
(3, 'ISTP', 'chill', 30),
(4, 'INFJ', 'soft', 50);

-- Circles
INSERT INTO `circles` (`name`, `type`, `description`) VALUES
('Breakup Healing', 'breakup', 'Safe space to heal and move on.'),
('Deep Talks Only', 'deep_talk', 'No small talk. Philosophy, life, universe.'),
('Bangalore Techies', 'city', 'For the code wizards of BLR.');

COMMIT;
