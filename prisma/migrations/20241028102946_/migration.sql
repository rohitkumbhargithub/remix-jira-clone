/*
  Warnings:

  - You are about to drop the column `clonedFromId` on the `Workspace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_clonedFromId_fkey";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "clonedFromId";
