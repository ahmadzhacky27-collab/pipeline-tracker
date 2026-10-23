/*
  Warnings:

  - You are about to alter the column `handle_name` on the `tbl_channels` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the column `is_completed` on the `tbl_checklists` table. All the data in the column will be lost.
  - You are about to drop the column `task_name` on the `tbl_checklists` table. All the data in the column will be lost.
  - You are about to drop the column `published_date` on the `tbl_contents` table. All the data in the column will be lost.
  - You are about to drop the column `scheduled_date` on the `tbl_contents` table. All the data in the column will be lost.
  - You are about to drop the column `script_draft` on the `tbl_contents` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `tbl_contents` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `published_url` on the `tbl_contents` table. The data in that column could be lost. The data in that column will be cast from `VarChar(508)` to `VarChar(191)`.
  - You are about to drop the column `created_at` on the `tbl_metrics` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `email` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password_hash` on the `tbl_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Added the required column `updated_at` to the `tbl_channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task` to the `tbl_checklists` table without a default value. This is not possible if the table is not empty.
  - Made the column `channel_id` on table `tbl_contents` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `tbl_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tbl_contents` DROP FOREIGN KEY `tbl_contents_channel_id_fkey`;

-- DropIndex
DROP INDEX `tbl_contents_channel_id_fkey` ON `tbl_contents`;

-- AlterTable
ALTER TABLE `tbl_channels` ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `platform` VARCHAR(191) NOT NULL,
    MODIFY `handle_name` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `tbl_checklists` DROP COLUMN `is_completed`,
    DROP COLUMN `task_name`,
    ADD COLUMN `is_done` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `task` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `tbl_contents` DROP COLUMN `published_date`,
    DROP COLUMN `scheduled_date`,
    DROP COLUMN `script_draft`,
    ADD COLUMN `editor_id` INTEGER NULL,
    ADD COLUMN `review_note` TEXT NULL,
    ADD COLUMN `review_url` VARCHAR(191) NULL,
    ADD COLUMN `scheduled_at` DATETIME(3) NULL,
    MODIFY `channel_id` INTEGER NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `format_type` VARCHAR(191) NOT NULL,
    MODIFY `priority` VARCHAR(191) NOT NULL DEFAULT 'medium',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'idea',
    MODIFY `published_url` VARCHAR(191) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tbl_metrics` DROP COLUMN `created_at`,
    MODIFY `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `tbl_users` ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password_hash` VARCHAR(191) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'creator',
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `tbl_content_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `review_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_contents` ADD CONSTRAINT `tbl_contents_editor_id_fkey` FOREIGN KEY (`editor_id`) REFERENCES `tbl_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_contents` ADD CONSTRAINT `tbl_contents_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `tbl_channels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_content_reviews` ADD CONSTRAINT `tbl_content_reviews_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `tbl_contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_content_reviews` ADD CONSTRAINT `tbl_content_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
