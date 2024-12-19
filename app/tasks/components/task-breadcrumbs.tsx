import { ProjectAvatar } from "../../projects/components/project-avatar";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import { Task } from "../types";
import { useConfirm } from "~/features/hooks/useConfirm";
import { Button } from "~/components/ui/button";
import { Form, useFetcher } from "@remix-run/react";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

interface TaskBreadcrumbsProps {
  project: any;
  task: Task;
  actionUrl: string;
}

export const TaskBreadcrumbs = ({
  project,
  task,
  actionUrl,
}: TaskBreadcrumbsProps) => {
  const fetcher = useFetcher();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task?",
    "This action can't be undone.",
    "destructive"
  );

  const handleDeleteTask = async (event) => {
    event.preventDefault();

    const confirmed = await confirm();
    if (confirmed) {
      fetcher.submit(event.target, { method: "delete" });
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar name={project.name} image={project.imageUrl} />
      <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
        <Link to={`/workspaces/${workspaceId}/projects/${task.projectId}`}>
          {project.name}
        </Link>
      </p>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Form method="post" action={actionUrl} className="ml-auto">
        <Button
          onClick={handleDeleteTask}
          className=""
          name="delete"
          value="delete"
          variant="destructive"
          size="sm"
        >
          <TrashIcon className="size-4 lg:mr-2" />
          <span className="hidden lg:block">Delete</span>
        </Button>
      </Form>
    </div>
  );
};
