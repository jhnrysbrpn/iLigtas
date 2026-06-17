-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `severity` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `affectedArea` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NOT NULL,
    `broadcastSMS` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HazardReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `reporterName` VARCHAR(191) NOT NULL,
    `reporterPhone` VARCHAR(191) NOT NULL,
    `locationName` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'Medium',
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedResponder` VARCHAR(191) NULL,
    `affectedFamiliesCount` INTEGER NOT NULL DEFAULT 0,
    `damageCostEstimated` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hazardReportId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvacuationCenter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `locationName` VARCHAR(191) NOT NULL,
    `currentOccupants` INTEGER NOT NULL DEFAULT 0,
    `maxCapacity` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Inactive',
    `contactPerson` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `hasMedicalSupply` BOOLEAN NOT NULL DEFAULT false,
    `hasRestrooms` BOOLEAN NOT NULL DEFAULT false,
    `hasKitchen` BOOLEAN NOT NULL DEFAULT false,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `registrantsCount` INTEGER NOT NULL DEFAULT 0,
    `registeredUsers` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockpileItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `minimumLevel` INTEGER NOT NULL,
    `lastUpdated` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VulnerabilityRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `familyName` VARCHAR(191) NOT NULL,
    `headOfHousehold` VARCHAR(191) NOT NULL,
    `membersCount` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `vulnerableMembers` VARCHAR(191) NOT NULL,
    `hazardExposure` VARCHAR(191) NOT NULL,
    `notified` BOOLEAN NOT NULL DEFAULT false,
    `registeredDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hydrant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `locationName` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReliefDistribution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `centerId` INTEGER NOT NULL,
    `batchName` VARCHAR(191) NOT NULL,
    `itemsDistributed` TEXT NOT NULL,
    `familiesServed` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_hazardReportId_fkey` FOREIGN KEY (`hazardReportId`) REFERENCES `HazardReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
