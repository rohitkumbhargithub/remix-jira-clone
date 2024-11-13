/*
  Warnings:

  - Made the column `assigneeId` on table `Tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "assigneeId" SET NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
