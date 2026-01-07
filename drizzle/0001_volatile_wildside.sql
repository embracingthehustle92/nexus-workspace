CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`description` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `canvas_elements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`projectId` int,
	`type` enum('shape','text','image','sticky','connector','frame') DEFAULT 'shape',
	`x` int DEFAULT 0,
	`y` int DEFAULT 0,
	`width` int DEFAULT 100,
	`height` int DEFAULT 100,
	`rotation` int DEFAULT 0,
	`content` json,
	`style` json,
	`zIndex` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `canvas_elements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `code_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`projectId` int,
	`parentId` int,
	`name` varchar(255) NOT NULL,
	`type` enum('file','folder') DEFAULT 'file',
	`language` varchar(50),
	`content` text,
	`path` varchar(1000),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `code_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`name` varchar(255) NOT NULL,
	`domain` varchar(255),
	`industry` varchar(100),
	`size` varchar(50),
	`revenue` varchar(50),
	`logo` text,
	`description` text,
	`address` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100),
	`email` varchar(320),
	`phone` varchar(50),
	`company` varchar(255),
	`jobTitle` varchar(255),
	`avatar` text,
	`status` enum('lead','prospect','customer','inactive') DEFAULT 'lead',
	`source` varchar(100),
	`notes` text,
	`tags` json,
	`customFields` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`title` varchar(500) NOT NULL,
	`type` enum('document','image','video','file','link') DEFAULT 'document',
	`content` json,
	`fileUrl` text,
	`fileKey` varchar(500),
	`mimeType` varchar(100),
	`fileSize` int,
	`category` varchar(100),
	`tags` json,
	`status` enum('draft','published','archived') DEFAULT 'draft',
	`version` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`contactId` int,
	`companyId` int,
	`title` varchar(255) NOT NULL,
	`value` int DEFAULT 0,
	`currency` varchar(10) DEFAULT 'USD',
	`stage` enum('lead','qualified','proposal','negotiation','closed_won','closed_lost') DEFAULT 'lead',
	`probability` int DEFAULT 0,
	`expectedCloseDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`threadId` varchar(100),
	`fromAddress` varchar(320) NOT NULL,
	`toAddresses` json,
	`ccAddresses` json,
	`subject` varchar(500),
	`body` text,
	`htmlBody` text,
	`folder` enum('inbox','sent','drafts','trash','archive','spam') DEFAULT 'inbox',
	`isRead` boolean DEFAULT false,
	`isStarred` boolean DEFAULT false,
	`hasAttachments` boolean DEFAULT false,
	`attachments` json,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`parentId` int,
	`title` varchar(500) NOT NULL DEFAULT 'Untitled',
	`content` json,
	`icon` varchar(64),
	`coverImage` text,
	`isArchived` boolean DEFAULT false,
	`isFavorite` boolean DEFAULT false,
	`position` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`color` varchar(32),
	`icon` varchar(64),
	`status` enum('active','on_hold','completed','cancelled') DEFAULT 'active',
	`startDate` timestamp,
	`endDate` timestamp,
	`progress` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int,
	`workspaceId` int,
	`title` varchar(500) NOT NULL,
	`description` text,
	`status` enum('backlog','todo','in_progress','review','done') DEFAULT 'todo',
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`dueDate` timestamp,
	`assigneeId` int,
	`tags` json,
	`position` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terminal_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspaceId` int,
	`name` varchar(100) DEFAULT 'Terminal',
	`history` json,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terminal_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`color` varchar(32),
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `preferences` json;