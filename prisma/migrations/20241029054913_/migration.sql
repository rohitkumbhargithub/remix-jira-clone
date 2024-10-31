-- CreateTable
CREATE TABLE "_JoinedWorkspaces" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JoinedWorkspaces_AB_unique" ON "_JoinedWorkspaces"("A", "B");

-- CreateIndex
CREATE INDEX "_JoinedWorkspaces_B_index" ON "_JoinedWorkspaces"("B");

-- AddForeignKey
ALTER TABLE "_JoinedWorkspaces" ADD CONSTRAINT "_JoinedWorkspaces_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedWorkspaces" ADD CONSTRAINT "_JoinedWorkspaces_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
