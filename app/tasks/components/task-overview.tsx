import { Button } from "~/components/ui/button";
import { Task } from "../types";
import { OverviewProperty } from "./overview-property";
import { TaskDate } from "./task-date";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { snakeCaseToTitleCase } from "~/lib/utils";
import { PencilLine } from "lucide-react";
import { MemberAvatar } from "~/features/member/components/members-avatar";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import EditModal from "~/componets/edit-modal";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

interface TaskOverViewProps {
  task: Task;
}

export const TaskOverView = ({ task }: TaskOverViewProps) => {
  const { tasks, projects } = useLoaderData();
  const userData = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = task.id;
  const workspaceId = useWorkspaceId();


  const openModal = async (id: string) => {
    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("taskId", id);

    await fetch(`/workspaces/${workspaceId}/tasks/${id}`, {
      method: "POST",
      body: formData,
    });

    searchParams.set("edit-task", "true");
    setSearchParams(searchParams);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    searchParams.delete("edit-task");
    setSearchParams(searchParams);
  };


  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <EditModal isOpen={isModalOpen} onClose={closeModal} taskId={id} tasks={tasks} projects={projects} members={userData}/>
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => openModal(id)} size="sm" variant="default">
            <PencilLine className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSperator className="my-4"/>
        <div className="flex flex-col gap-y-4">
            <OverviewProperty label="Assignee">
                <MemberAvatar
                    name={task.assignee.name}
                    classname="size-6"
                />
                <p className="text-sm font-medium">{task.assignee.name}</p>
            </OverviewProperty>

            <OverviewProperty label="Due Date">
                <TaskDate value={task.dueDate} className="text-sm font-medium " />
            </OverviewProperty>

            <OverviewProperty label="Status">
                <Badge variant={task.status} >
                    {snakeCaseToTitleCase(task.status)}
                </Badge>
            </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
