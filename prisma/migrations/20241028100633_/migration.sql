-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "clonedFromId" INTEGER;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_clonedFromId_fkey" FOREIGN KEY ("clonedFromId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
