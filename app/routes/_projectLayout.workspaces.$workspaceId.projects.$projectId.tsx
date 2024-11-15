import { ActionFunctionArgs } from "@remix-run/node";
import { json, Link, redirect, useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { PencilIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ProjectAvatar } from "~/projects/components/project-avatar";
import { TaskViewSwitcher } from "~/tasks/components/task-switcher";
import { authenticator } from "~/utils/auth.server";
import { getProjectsByWorkspace } from "~/utils/project.server";
import { getUserSession } from "~/utils/session.server";
import { createTask, deleteTask, getTask, updateTask } from "~/utils/task.server";
import { getAllUsers } from "~/utils/user.server";
import { getAllMemeber } from "~/utils/workspace.server";

export const loader = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in"
  });
  const user = await getUserSession(request);
  const members = await getAllMemeber(request);
  const userData = await getAllUsers();
  const tasks = await getTask(request);
  const workspaceId = params.workspaceId;
  const projectId = params.projectId;
  const id = Number(workspaceId);
  
  const projects = await getProjectsByWorkspace(request, id);

  return { user, projects, projectId, members, userData, tasks };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.formData();
  const workspaceId = Number(params.workspaceId);
  const projectId = Number(form.get("projectId"));


  if (form.get("_method") === "POST") {
  const name = form.get("taskName");
  const date = form.get("dueDate");
  const dueDateObj = new Date(date);
  const dueDate = dueDateObj.toISOString();
  const status = form.get("status");
  const assigneeId = Number(form.get("assigneeId"));

  const position = 1000;

  const tasks = {
    name,
    workspaceId,
    assigneeId,
    projectId,
    dueDate,
    status,
    position,
  }

  try {
    await createTask(tasks, request);
    return redirect(`/workspaces/${workspaceId}/projects/${projectId}`);
  } catch (error) {
    console.error("Error creating project:", error);
    return json({ error: error.message }, { status: 400 });
  }
  }


  if (form.get("_method") === "DELETE") {
    const taskId = form.get("taskId");
    try {
      await deleteTask(Number(taskId), request); 
      return redirect(`/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      return json({ error: "Failed to delete task" }, { status: 500 });
    }
  }

  if (form.get("_method") === "PATCH") {
    try{

      const taskName = form.get("updateTaskName");
      const dueDate = form.get("updateDueDate");
      const projectId = form.get("UpdateProjectId");
      const status = form.get("UpdateStatus");
      const taskId = form.get("taskId");

      return null;
      
    }catch(error){
      console.log(error)
    }
  }

};

const ProjectId = () => {
  const userData = useLoaderData();
  const { projects, members, tasks } = useLoaderData();
  const { projectId } = useParams();
  const id = Number(projectId);

  const project = projects.find((proj) => proj.id === id);
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project?.name}
            image={project?.imageUrl}
            classname="size-8"
          />
          <p className="text-lg font-semibold">{project?.name}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            to={`/workspaces/${project?.workspaceId}/projects/${project?.id}/settings`}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher
        projects={projects}
        members={userData}
        tasks={tasks}
      />
    </div>
  );
};

export default ProjectId;
