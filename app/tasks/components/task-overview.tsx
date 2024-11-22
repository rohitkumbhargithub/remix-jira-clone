import { Button } from "~/components/ui/button";
import { Task } from "../types";
import { OverviewProperty } from "./overview-property";
import { TaskDate } from "./task-date";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { snakeCaseToTitleCase } from "~/lib/utils";
import { PencilLine } from "lucide-react";
import { MemberAvatar } from "~/features/member/components/members-avatar";
import { Badge } from "~/components/ui/badge";
// import { useEditTasksModal } from "../hooks/use-edit-tasks-modal";

interface TaskOverViewProps {
  task: Task;
}

export const TaskOverView = ({ task }: TaskOverViewProps) => {
    // const { open } = useEditTasksModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => open(task.id)} size="sm" variant="default">
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
