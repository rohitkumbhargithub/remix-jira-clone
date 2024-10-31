/*
  Warnings:

  - You are about to drop the `_JoinedWorkspaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_JoinedWorkspaces" DROP CONSTRAINT "_JoinedWorkspaces_A_fkey";

-- DropForeignKey
ALTER TABLE "_JoinedWorkspaces" DROP CONSTRAINT "_JoinedWorkspaces_B_fkey";

-- DropTable
DROP TABLE "_JoinedWorkspaces";
