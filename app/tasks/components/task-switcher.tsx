import { Calendar, Kanban, PlusIcon, Table } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useCallback, useState } from "react";
import { useFetcher, useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import TaskModal from "~/componets/task-modal";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useTaskFilters } from "../hooks/use-filter-tasks";
import { DataFilters } from "./task-filter";
import { DataKanban } from "./data-kanban";
import { DataCelander } from "./data-calender";
import { TaskStatus } from "../types";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
  projects : {},
  members: {},
  tasks: {},
}

export const TaskViewSwitcher = ({
  projects,
  members,
  tasks,
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const { status, assigneeId, projectId, dueDate } = useTaskFilters();
  const { workspaceId } = useParams();
  const WorkspaceID = Number(workspaceId);
  const ProjectID = Number(projectId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  const onKanbanChange = useCallback(
    (tasks: { id: number; status: TaskStatus; position: number }[]) => {
      fetcher.submit(
        { tasks: JSON.stringify(tasks) },
        { method: "post", action: `/workspaces/${WorkspaceID}/projects/${ProjectID}/bulk-update` }
      );
    },
    [fetcher, workspaceId, projectId]
  );
  


  const filteredTasks = tasks.filter(task => {
    // Filter by status if it's provided
    const statusMatches = status ? task.status === status : true;
  
    // Convert assigneeId and projectId to numbers and filter accordingly
    const assigneeMatches = assigneeId ? task.assigneeId === Number(assigneeId) : true;
    const projectMatches = projectId ? task.projectId === Number(projectId) : true;
  
    // Filter by dueDate if it's provided
    const dueDateMatches = dueDate
    ? new Date(task.dueDate).toDateString() === new Date(dueDate).toDateString()
    : true;
  
    return statusMatches && assigneeMatches && projectMatches && dueDateMatches;
  });

  const [view, setView] = useState(searchParams.get("task-view") || "table");

  const data = members;
  const id = parseInt(workspaceId, 10);
  const currentWorkspaceId = id; // Use the parsed workspaceId to match the current workspace

  // Filter members that belong to the current workspace
  const membersInCurrentWorkspace = data.members.filter(
    (member) => member.workspaceId === currentWorkspaceId
  );

  // Get the user IDs from the filtered members
  const userIdsInCurrentWorkspace = membersInCurrentWorkspace.map(
    (member) => member.userId
  );

  // Find the user information for these user IDs
  const usersInCurrentWorkspace = data.userData.filter((user) =>
    userIdsInCurrentWorkspace.includes(user.id)
  );

  // Resulting list of users in the current workspace
  const users = usersInCurrentWorkspace;


  const openModal = () => {
    // const newUrl = `/workspaces/${workspaceId}`;
    // window.location.href = newUrl;
    searchParams.set("create-task", "true");
    setSearchParams(searchParams);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    searchParams.delete("create-task");
    setSearchParams(searchParams);
  };

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projects={projects}
        members={members}
      />
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="table"
              onClick={() => setView("table")}
            >
               <div className="inline-flex items-center">
                <Table className="size-3 m-1"/>
                Table
              </div>
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
            <div className="inline-flex items-center">
                <Kanban className="size-3 m-1"/>
                Kanban
              </div>
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
            <div className="inline-flex items-center">
                <Calendar className="size-3 m-1"/>
                Calender
              </div>
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={openModal}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSperator className="my-4" />
        <DataFilters
          hideProjectFilter={hideProjectFilter}
          projects={projects}
          members={users}
        />
        <DottedSperator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            {view === "table" && (
              <DataTable columns={columns} data={filteredTasks ?? []} />
            )}
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
          <DataKanban onChange={onKanbanChange} data={filteredTasks ?? []} />
          </TabsContent>
          <TabsContent value="calender" className="mt-0">
          <DataCelander data={filteredTasks ?? []} />

          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
