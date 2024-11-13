import { ActionFunctionArgs } from "@remix-run/node";
import { json, Link, redirect, useLoaderData, useParams } from "@remix-run/react";
import { PencilIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ProjectAvatar } from "~/projects/components/project-avatar";
import { TaskViewSwitcher } from "~/tasks/components/task-switcher";
import { authenticator } from "~/utils/auth.server";
import { getProjectsByWorkspace } from "~/utils/project.server";
import { getUserSession } from "~/utils/session.server";
import { createTask, getTask } from "~/utils/task.server";
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
  const form = await request.clone().formData();
  const workspaceId = Number(params.workspaceId);
  const name = form.get("taskName");
  const date = form.get("dueDate");
  const dueDateObj = new Date(date);
  const dueDate = dueDateObj.toISOString();
  const status = form.get("status");
  const projectId = Number(form.get("projectId"));
  const assigneeId = Number(form.get("assigneeId"));

  const deleteTask = form.get('form');

  if(deleteTask){
    console.log(deleteTask)
  }

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
            name={project.name}
            image={project.imageUrl}
            classname="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            to={`/workspaces/${project.workspaceId}/projects/${project.id}/settings`}
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
