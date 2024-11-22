import { useLoaderData, useParams } from "@remix-run/react";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { TaskBreadcrumbs } from "~/tasks/components/task-breadcrumbs";
import { TaskDescription } from "~/tasks/components/task-description";
import { TaskOverView } from "~/tasks/components/task-overview";
import { authenticator } from "~/utils/auth.server";
import { getProjectsByWorkspace } from "~/utils/project.server";
import { getUserSession } from "~/utils/session.server";
import { getTask } from "~/utils/task.server";
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
  
}


const TaskId = () => {
  const { tasks } = useLoaderData();
  const taskId = useParams();
  const taskIdData = taskId.taskId;
  const getTaskById = (id) => tasks.find(task => task.id === id);
  const data = getTaskById(Number(taskIdData));
  return (
    <div className="flex flex-col">
            <TaskBreadcrumbs project={data.project} task={data} />
            <DottedSperator className="my-3"/>
            <div className="grid grid-cols lg:grid-cols-2 gap-4">
                <TaskOverView task={data} />
                <TaskDescription task={data} />
            </div>
        </div>
  )
}


export default TaskId;