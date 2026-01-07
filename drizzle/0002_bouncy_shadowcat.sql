CREATE TABLE `breach_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`passwordId` int,
	`breachName` varchar(255),
	`breachDate` timestamp,
	`description` text,
	`severity` enum('low','medium','high','critical') DEFAULT 'medium',
	`isResolved` boolean DEFAULT false,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breach_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mfa_backup_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`passwordId` int,
	`totpId` int,
	`encryptedCodes` text NOT NULL,
	`usedCodes` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mfa_backup_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_folders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`parentId` int,
	`name` varchar(255) NOT NULL,
	`icon` varchar(64),
	`color` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `password_folders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`passwordId` int NOT NULL,
	`encryptedPassword` text NOT NULL,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_vault` (
	`id` int AUTO_INCREMENT NOT NULL,
	`odId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`username` varchar(320),
	`encryptedPassword` text NOT NULL,
	`url` text,
	`category` varchar(100),
	`folderId` int,
	`icon` varchar(64),
	`favicon` text,
	`notes` text,
	`isFavorite` boolean DEFAULT false,
	`lastUsed` timestamp,
	`passwordStrength` int DEFAULT 0,
	`customFields` json,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `password_vault_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `secrets_vault` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('api_key','credential','certificate','token','ssh_key','other') DEFAULT 'credential',
	`category` varchar(100),
	`encryptedValue` text NOT NULL,
	`description` text,
	`expiresAt` timestamp,
	`lastUsed` timestamp,
	`tags` json,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `secrets_vault_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storage_drives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('local','cloud','virtual','network','external') DEFAULT 'local',
	`provider` varchar(100),
	`icon` varchar(64),
	`color` varchar(32),
	`totalSpace` varchar(50),
	`usedSpace` varchar(50),
	`status` enum('connected','disconnected','syncing','error') DEFAULT 'connected',
	`credentials` text,
	`mountPath` varchar(500),
	`lastSynced` timestamp,
	`settings` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storage_drives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storage_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`driveId` int NOT NULL,
	`parentId` int,
	`name` varchar(500) NOT NULL,
	`type` enum('file','folder','shortcut') DEFAULT 'file',
	`mimeType` varchar(200),
	`size` varchar(50),
	`path` varchar(2000),
	`fileUrl` text,
	`fileKey` varchar(500),
	`thumbnail` text,
	`isStarred` boolean DEFAULT false,
	`isTrashed` boolean DEFAULT false,
	`isShared` boolean DEFAULT false,
	`shareSettings` json,
	`metadata` json,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storage_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `totp_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`odId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`passwordId` int,
	`name` varchar(255) NOT NULL,
	`issuer` varchar(255),
	`encryptedSecret` text NOT NULL,
	`algorithm` varchar(20) DEFAULT 'SHA1',
	`digits` int DEFAULT 6,
	`period` int DEFAULT 30,
	`icon` varchar(64),
	`favicon` text,
	`category` varchar(100),
	`isFavorite` boolean DEFAULT false,
	`lastUsed` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `totp_tokens_id` PRIMARY KEY(`id`)
);
