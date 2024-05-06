/*
  Warnings:

  - You are about to alter the column `status` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_barberPackageId_fkey`;

-- AlterTable
ALTER TABLE `barberstore` ADD COLUMN `barberServiceTime` DOUBLE NOT NULL DEFAULT 1,
    ADD COLUMN `barberType` ENUM('Male', 'Female', 'Kids', 'Makeup') NOT NULL DEFAULT 'Male',
    ADD COLUMN `desc` VARCHAR(191) NULL,
    ADD COLUMN `endTime` VARCHAR(191) NOT NULL DEFAULT '9 PM',
    ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 5,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL DEFAULT '8 AM';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `OTP` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('Male', 'Female') NOT NULL DEFAULT 'Male',
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('Verifed', 'Pending') NOT NULL DEFAULT 'Pending',
    MODIFY `barberPackageId` INTEGER NULL;

-- CreateTable
CREATE TABLE `favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `barberStoreId` INTEGER NOT NULL,

    UNIQUE INDEX `favorite_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barber_service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barberStoreId` INTEGER NOT NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,

    UNIQUE INDEX `barber_service_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NULL,
    `serviceId` INTEGER NULL,

    UNIQUE INDEX `booking_services_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `barberStoreId` INTEGER NOT NULL,
    `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('Booked', 'Waiting', 'InProcess', 'Finished') NOT NULL DEFAULT 'Booked',
    `rating` INTEGER NULL,
    `ratingDesc` VARCHAR(191) NULL,

    UNIQUE INDEX `booking_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_barberPackageId_fkey` FOREIGN KEY (`barberPackageId`) REFERENCES `packages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_barberStoreId_fkey` FOREIGN KEY (`barberStoreId`) REFERENCES `barberStore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barber_service` ADD CONSTRAINT `barber_service_barberStoreId_fkey` FOREIGN KEY (`barberStoreId`) REFERENCES `barberStore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_services` ADD CONSTRAINT `booking_services_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_services` ADD CONSTRAINT `booking_services_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `barber_service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_barberStoreId_fkey` FOREIGN KEY (`barberStoreId`) REFERENCES `barberStore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
