import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import { TaskViewSwitcher } from "~/tasks/components/task-switcher";
import { authenticator } from "~/utils/auth.server";
import { getProjectsByWorkspace } from "~/utils/project.server";
import { getUserSession } from "~/utils/session.server";
import { getTask } from "~/utils/task.server";
import { getAllUsers } from "~/utils/user.server";
import { getAllMemeber } from "~/utils/workspace.server";

export const loader = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
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

const Tasks = () => {
  const userData = useLoaderData();
  const { projects, members, tasks } = useLoaderData();
  const { projectId } = useParams();
  const id = Number(projectId);

  const project = projects.find((proj) => proj.id === id);
  return (
    <>
      <TaskViewSwitcher projects={projects} members={userData} tasks={tasks} hideProjectFilter />
    </>
  );
};

export default Tasks;
