-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_workspaceId_fkey";
