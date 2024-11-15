import { ExternalLinkIcon, TrashIcon, PencilIcon } from "lucide-react";
import { useConfirm } from "~/features/hooks/useConfirm";
import { Form, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// import { useDeleteTask } from "../api/use-delete-task";
import { useEditTasksModal } from "../hooks/use-Edit-modal";
import { useState } from "react";
import TaskModal from "~/componets/task-modal";
import EditModal from "~/componets/edit-modal";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionProps) => {
  const { tasks, projects } = useLoaderData();
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  


  // const { open } = useEditTasksModal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const openModal = async (id: string) => {


    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("taskId", id);

    await fetch(`/workspaces/${workspaceId}/projects/${projectId}`, {
      method: "POST",
      body: formData,
    });
    navigate(`/workspaces/${workspaceId}/projects/${projectId}`);

    searchParams.set("edit-task", "true");
    setSearchParams(searchParams);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    searchParams.delete("edit-task");
    setSearchParams(searchParams);
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  );

  const handleDelete = async (id: string) => {
    const ok = await confirmDelete();
    if (!ok) return;
    const formData = new FormData();
    formData.append("_method", "DELETE");
    formData.append("taskId", id);

    await fetch(`/workspaces/${workspaceId}/projects/${projectId}`, {
      method: "POST",
      body: formData,
    });
    navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const onOpenTask = () => {
    navigate(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <DeleteDialog />
      <EditModal isOpen={isModalOpen} onClose={closeModal} taskId={id} tasks={tasks} projects={projects}/>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openModal(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <Form
            method="post"
            action={`/workspaces/${workspaceId}/projects/${projectId}`}
          >
            <input type="hidden" name="_method" value="DELETE" />
            <DropdownMenuItem
              onClick={() => handleDelete(id)}
              className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            >
              <TrashIcon className="size-4 mr-2 stroke-2" />
              Delete Task
            </DropdownMenuItem>
          </Form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
