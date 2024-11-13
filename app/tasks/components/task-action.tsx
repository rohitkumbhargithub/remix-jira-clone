import { ExternalLinkIcon, TrashIcon, PencilIcon } from "lucide-react";
import { useConfirm } from "~/features/hooks/useConfirm";
import { Form, useNavigate, useSearchParams } from "@remix-run/react";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

// import { useDeleteTask } from "../api/use-delete-task";
import { useEditTasksModal } from "../hooks/use-Edit-modal";
import { useState } from "react";
import TaskModal from "~/componets/task-modal";
import EditModal from "~/componets/edit-modal";

interface TaskActionProps {
    id: string,
    projectId: string,
    children: React.ReactNode,
};

export const TaskActions = ({id, projectId, children}: TaskActionProps ) => {
    const workspaceId = useWorkspaceId();
    const router = useNavigate();

    // const { open } = useEditTasksModal();

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();


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

    const [ DeleteDialog, confirmDelete ] = useConfirm(
        "Delete task",
        "This action cannot be undone",
        "destructive"
    )

    // const { mutate, isPending } = useDeleteTask();


    const handleDelete = async () => {
        const ok = await confirmDelete();

    //     if(!ok) return;

    //    mutate({ param: {taskId: id} })
    }

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }

    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    return (
        <div className="flex justify-end">
            <DeleteDialog/> 
            <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={onOpenTask}
                        // disabled={false}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onOpenProject}
                        // disabled={false}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                         onClick={openModal}
                        // disabled={false}
                        className="font-medium p-[10px]"
                    >
                        <PencilIcon className="size-4 mr-2 stroke-2"/>
                        Edit Task
                    </DropdownMenuItem>
                    <Form method="delete">
                    <DropdownMenuItem
                        onClick={handleDelete}
                        // disabled={isPending}
                        name="delete"
                        className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2"/>
                        Delete Task
                    </DropdownMenuItem>
                    </Form>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}