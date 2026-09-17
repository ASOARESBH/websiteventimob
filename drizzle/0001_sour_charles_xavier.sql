CREATE TABLE `agencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(150) NOT NULL,
	`logoUrl` text,
	`countryCode` varchar(10) NOT NULL DEFAULT 'BR',
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`address` text,
	`description` text,
	`phone` varchar(30),
	`whatsapp` varchar(30),
	`email` varchar(150),
	`website` varchar(255),
	`creci` varchar(50),
	`teamSize` int DEFAULT 1,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `agencies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `broker_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`whatsapp` varchar(30) NOT NULL,
	`countryCode` varchar(10) NOT NULL,
	`state` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`creci` varchar(50) NOT NULL,
	`professionalType` enum('autonomo','imobiliaria') NOT NULL,
	`status` enum('pendente','aprovado','rejeitado') NOT NULL DEFAULT 'pendente',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `broker_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brokers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`userId` int,
	`agencyId` int,
	`name` varchar(150) NOT NULL,
	`avatarUrl` text,
	`creci` varchar(50) NOT NULL,
	`countryCode` varchar(10) NOT NULL DEFAULT 'BR',
	`state` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`phone` varchar(30),
	`whatsapp` varchar(30),
	`email` varchar(150),
	`specialty` varchar(120),
	`bio` text,
	`rating` decimal(3,2) DEFAULT '4.90',
	`dealsCount` int DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brokers_id` PRIMARY KEY(`id`),
	CONSTRAINT `brokers_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(100) NOT NULL,
	`flagEmoji` varchar(10) NOT NULL,
	`phoneCode` varchar(10) NOT NULL,
	`defaultCurrency` varchar(10) NOT NULL,
	`currencySymbol` varchar(10) NOT NULL,
	`defaultLanguage` varchar(10) NOT NULL,
	`whatsappNumber` varchar(30) NOT NULL DEFAULT '',
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int,
	`brokerId` int,
	`agencyId` int,
	`name` varchar(150) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`message` text NOT NULL,
	`origin` varchar(50) NOT NULL DEFAULT 'portal_web',
	`countryCode` varchar(10) NOT NULL DEFAULT 'BR',
	`status` enum('novo','em_atendimento','visita_agendada','convertido','arquivado') NOT NULL DEFAULT 'novo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(40) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`purpose` enum('comprar','alugar') NOT NULL,
	`type` enum('casa','apartamento','terreno','comercial','cobertura','lancamento') NOT NULL,
	`status` enum('rascunho','pendente','publicado','pausado','vendido','alugado','expirado','cancelado') NOT NULL DEFAULT 'publicado',
	`source` enum('VENTIMOB','ERP','API','IMPORTACAO') NOT NULL DEFAULT 'VENTIMOB',
	`price` decimal(14,2) NOT NULL,
	`condoFee` decimal(12,2),
	`iptuFee` decimal(12,2),
	`currency` varchar(10) NOT NULL DEFAULT 'BRL',
	`countryCode` varchar(10) NOT NULL DEFAULT 'BR',
	`state` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`neighborhood` varchar(120) NOT NULL,
	`addressPublic` varchar(255),
	`addressExact` text,
	`showExactAddress` boolean NOT NULL DEFAULT false,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`bedrooms` int NOT NULL DEFAULT 0,
	`bathrooms` int NOT NULL DEFAULT 0,
	`suites` int NOT NULL DEFAULT 0,
	`parkingSpots` int NOT NULL DEFAULT 0,
	`totalArea` decimal(10,2),
	`privateArea` decimal(10,2),
	`description` text NOT NULL,
	`features` json,
	`images` json,
	`videoUrl` text,
	`virtualTourUrl` text,
	`featured` boolean NOT NULL DEFAULT false,
	`brokerId` int,
	`agencyId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `properties_code_unique` UNIQUE(`code`),
	CONSTRAINT `properties_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(80) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','broker','agency_admin','admin') NOT NULL DEFAULT 'user';