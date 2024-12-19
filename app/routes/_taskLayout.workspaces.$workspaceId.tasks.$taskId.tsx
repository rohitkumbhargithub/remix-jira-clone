import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useParams } from "@remix-run/react";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { TaskBreadcrumbs } from "~/tasks/components/task-breadcrumbs";
import { TaskDescription } from "~/tasks/components/task-description";
import { TaskOverView } from "~/tasks/components/task-overview";
import { authenticator } from "~/utils/auth.server";
import { getProjectsByWorkspace } from "~/utils/project.server";
import { getUserSession } from "~/utils/session.server";
import { deleteTask, getTask, updateDescription } from "~/utils/task.server";
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


export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.clone().formData();
  const taskId = params.taskId;
  const workspaceId = params.workspaceId;

  const deleteAction = form.get("delete");
  const descriptionAction = form.get("description");

  if(descriptionAction){
    try {
      await updateDescription(Number(taskId), descriptionAction, request); 
      return redirect(`/workspaces/${workspaceId}/tasks/${taskId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      return json({ error: "Failed to delete task" }, { status: 500 });
    }
  }
  

  if(deleteAction === "delete"){
    try {
      await deleteTask(Number(taskId), request); 
      return redirect(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      return json({ error: "Failed to delete task" }, { status: 500 });
    }
    
  }
  
  return null;
  
}


const TaskId = () => {
  const { tasks } = useLoaderData();
  const taskId = useParams();
  const workspaceParams = useParams();
  const WorkspaceIdData = workspaceParams.workspaceId;
  const workspaceId = Number(WorkspaceIdData);
  const taskIdData = taskId.taskId;
  const getTaskById = (id) => tasks.find(task => task.id === id);
  const data = getTaskById(Number(taskIdData));
  return (
    <div className="flex flex-col">
            <TaskBreadcrumbs project={data.project} task={data} actionUrl={`/workspaces/${workspaceId}/tasks/${taskIdData}`} />
            <DottedSperator className="my-3"/>
            <div className="grid grid-cols lg:grid-cols-2 gap-4">
                <TaskOverView task={data} />
                <TaskDescription task={data} />
            </div>
        </div>
  )
}


export default TaskId;