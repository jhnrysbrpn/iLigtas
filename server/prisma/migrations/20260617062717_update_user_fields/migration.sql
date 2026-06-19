/*
  Warnings:

  - You are about to drop the column `age` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `age`,
    ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `departmentId` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `requestedRole` VARCHAR(191) NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'Resident',
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

