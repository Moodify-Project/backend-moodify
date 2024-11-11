-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInformation` (
    `emailUser` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserInformation_emailUser_key`(`emailUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserInformation` ADD CONSTRAINT `UserInformation_emailUser_fkey` FOREIGN KEY (`emailUser`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
