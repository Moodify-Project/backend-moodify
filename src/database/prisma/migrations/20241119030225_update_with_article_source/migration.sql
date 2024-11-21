-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female', 'secret') NULL,
    `country` VARCHAR(191) NULL,
    `urlphoto` VARCHAR(191) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Journal` (
    `emailAuthor` VARCHAR(191) NOT NULL,
    `journalId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isPredicted` BOOLEAN NOT NULL,

    UNIQUE INDEX `Journal_journalId_key`(`journalId`),
    PRIMARY KEY (`journalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moodName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Mood_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MoodOnJournal` (
    `moodId` INTEGER NOT NULL,
    `journalId` VARCHAR(191) NOT NULL,
    `percentage` INTEGER NOT NULL,

    PRIMARY KEY (`moodId`, `journalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `urlToImage` VARCHAR(191) NOT NULL,
    `publishedAt` DATETIME(3) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBookmarkArticle` (
    `emailUser` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`articleId`, `emailUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_emailAuthor_fkey` FOREIGN KEY (`emailAuthor`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoodOnJournal` ADD CONSTRAINT `MoodOnJournal_moodId_fkey` FOREIGN KEY (`moodId`) REFERENCES `Mood`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoodOnJournal` ADD CONSTRAINT `MoodOnJournal_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`journalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBookmarkArticle` ADD CONSTRAINT `UserBookmarkArticle_emailUser_fkey` FOREIGN KEY (`emailUser`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBookmarkArticle` ADD CONSTRAINT `UserBookmarkArticle_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
