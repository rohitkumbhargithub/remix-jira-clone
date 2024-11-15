
import { 
    CircleCheckIcon,
    CircleDashedIcon,
    CircleDotDashedIcon,
    CircleDotIcon,
    CircleIcon,
    PlusIcon,
} from "lucide-react";

import { snakeCaseToTitleCase } from "~/lib/utils";
import { TaskStatus } from "../types";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import TaskModal from "~/componets/task-modal";
import { useLoaderData, useSearchParams } from "@remix-run/react";
// import { useCreateTasksModal } from "../hooks/use-create-tasks-modal";

interface KanbanColumnHeaderProps {
    board: TaskStatus,
    taskCount: number,
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: (
        <CircleDashedIcon className="size-[18-px] text-pink-400" />
    ),
    [TaskStatus.IN_PROGRESS]: (
        <CircleDotDashedIcon className="size-[18-px] text-yellow-400" />
    ),
    [TaskStatus.IN_REVIEW]: (
        <CircleDotIcon className="size-[18-px] text-blue-400" />
    ),
    [TaskStatus.TODO]: (
        <CircleIcon className="size-[18-px] text-red-400" />
    ),
    [TaskStatus.DONE]: (
        <CircleCheckIcon className="size-[18-px] text-green-400" />
    )
}

export const KanbanColoumHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
    // const { open } = useCreateTasksModal();
    const icon = statusIconMap[board];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { projects } = useLoaderData();
    const userData = useLoaderData();
    
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
        <div className="px-1 py-1 flex items-center justify-center">
            <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projects={projects}
        members={userData}
      />
            <div className="flex items-center gap-x-2">
                {icon}
                <h2 className="text-sm font-medium">
                    {snakeCaseToTitleCase(board)}
                </h2>
                <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                    {taskCount}
                </div>
            <Button onClick={openModal} variant="ghost" size="icon" className="size-5">
                <PlusIcon className="size-4 text-neutral-500"/>
            </Button>
            </div>
        </div>
    )
}