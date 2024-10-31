/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "updatedAt";
