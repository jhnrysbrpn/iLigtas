-- AlterTable
ALTER TABLE `User`
    ADD COLUMN `dataConsentAccepted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `dataConsentSignature` VARCHAR(191) NULL,
    ADD COLUMN `dataConsentSignedAt` DATETIME(3) NULL;
