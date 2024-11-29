-- AlterTable
ALTER TABLE `article` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `refreshtoken` VARCHAR(191) NULL;
