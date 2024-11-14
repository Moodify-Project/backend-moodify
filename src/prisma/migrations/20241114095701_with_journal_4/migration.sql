-- AlterTable
ALTER TABLE `journal` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `urlphoto` VARCHAR(191) NULL;
