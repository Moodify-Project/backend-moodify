/*
  Warnings:

  - Added the required column `isPredicted` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `journal` ADD COLUMN `isPredicted` BOOLEAN NOT NULL;
