CREATE TABLE `BingoCard` (
	`id` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `Prediction` (
	`id` char(36) NOT NULL,
	`bingoCardId` char(36) NOT NULL,
	`description` text NOT NULL,
	`position` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `User` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(191),
	`loginToken` varchar(191),
	`loginTokenExpiresAt` timestamp NULL,
	`isAdmin` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
ALTER TABLE `BingoCard`
	ADD CONSTRAINT `BingoCard_userId_User_id_fk`
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
	ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `Prediction`
	ADD CONSTRAINT `Prediction_bingoCardId_BingoCard_id_fk`
	FOREIGN KEY (`bingoCardId`) REFERENCES `BingoCard`(`id`)
	ON DELETE CASCADE;--> statement-breakpoint
CREATE UNIQUE INDEX `BingoCard_userId_key` ON `BingoCard` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Prediction_bingoCardId_position_key` ON `Prediction` (`bingoCardId`,`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_key` ON `User` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_loginToken_key` ON `User` (`loginToken`);