import {
  LoaderFunction,
  ActionFunctionArgs,
  UploadHandler,
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { createWorkspaces, getAllMemeber } from "~/utils/workspace.server";
import {
  Link,
  redirect,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import { generateInviteCode } from "~/lib/utils";
import { createProject, getProjectsByWorkspace } from "~/utils/project.server";
import { useWorkspaceId } from "~/hooks/user-workspaceId";
import { Button } from "~/components/ui/button";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { Card, CardContent } from "~/components/ui/card";
import { ProjectAvatar } from "~/projects/components/project-avatar";
import {
  getTask,
  getTotalAssignee,
  getTotalCompleteTask,
  getTotalInCompleteTask,
  getTotalOverDueTask,
  getTotalTasks,
} from "~/utils/task.server";
import { formatDistanceToNow } from "date-fns";
import { Analytics } from "~/componets/ui/analytics";
import { getAllUsers } from "~/utils/user.server";
import { MemberAvatar } from "~/features/member/components/members-avatar";
import { useState } from "react";
import ProjectModal from "~/componets/project-modal";
import TaskModal from "~/componets/task-modal";

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });
  const workspaceId = params.workspaceId;
  const members = await getAllMemeber(request);
  const id = Number(workspaceId);
  const assignee = await getTotalAssignee(id, null);
  const totalTask = await getTotalTasks(id, null);
  const completedTask = await getTotalCompleteTask(id, null);
  const inCompletedTask = await getTotalInCompleteTask(id, null);
  const overDueTask = await getTotalOverDueTask(id, null);
  const userData = await getAllUsers();

  let projects, tasks;
  if (id) {
    projects = await getProjectsByWorkspace(request, id);
    tasks = await getTask(request);
  }

  return {
    workspaceId,
    userData,
    projects,
    tasks,
    members,
    totalTask,
    assignee,
    completedTask,
    inCompletedTask,
    overDueTask,
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.clone().formData();

  const workspaceId = params.workspaceId;
  const isWorkspaceForm = form.has("workspaceName");

  if (isWorkspaceForm) {
    let imageUrl = form.get("img");
    const name = form.get("workspaceName");
    const inviteCode = generateInviteCode(6);
    if (!name) {
      return json({ error: "Workspace name is required." }, { status: 400 });
    }

    if (!inviteCode) {
      return json({ error: "Invite code generation failed." }, { status: 400 });
    }

    if (imageUrl && imageUrl.size > 0) {
      const uploadHandler: UploadHandler = composeUploadHandlers(
        async ({ name, data }) => {
          if (name !== "img") {
            return undefined;
          }

          const uploadedImage = await uploadImage(data);
          return uploadedImage.secure_url;
        },
        createMemoryUploadHandler()
      );

      const formData = await parseMultipartFormData(request, uploadHandler);
      imageUrl = formData.get("img");
    } else {
      imageUrl = "";
    }

    const workspace = {
      name,
      imageUrl,
      inviteCode,
    };

    try {
      const newWorkspace = await createWorkspaces(workspace, request);
      console.log("ertert")
      return redirect(`/workspaces/${newWorkspace?.id}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      return json({ error: error.message }, { status: 400 });
    }
  }

  const isProjectForm = form.has("projectName");
  if (isProjectForm) {
    const name = form.get("projectName");
    let imageUrl = form.get("img");

    if (!name) {
      return json({ error: "Workspace name is required." }, { status: 400 });
    }

    if (imageUrl && imageUrl.size > 0) {
      const uploadHandler: UploadHandler = composeUploadHandlers(
        async ({ name, data }) => {
          if (name !== "img") {
            return undefined;
          }

          const uploadedImage = await uploadImage(data);
          return uploadedImage.secure_url;
        },
        createMemoryUploadHandler()
      );

      const formData = await parseMultipartFormData(request, uploadHandler);
      imageUrl = formData.get("img");
    } else {
      imageUrl = "";
    }

    const project = {
      name,
      imageUrl,
    };

    try {
      const newProject = await createProject(workspaceId, project, request);
      return redirect(`/workspaces/${workspaceId}/projects/${newProject?.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      return json({ error: error.message }, { status: 400 });
    }
  }
};

const WorkspaceId = () => {
  const { projects, tasks, members } = useLoaderData();

  const getUsersByWorkspaceId = (workspaceId) => {
    return members
      .filter((entry) => entry.workspaceId === workspaceId)
      .map((entry) => ({
        id: entry.id,
        workspaceId: entry.workspaceId,
        name: entry.user.name,
        email: entry.user.email,
        role: entry.role,
        workspaceName: entry.workspace.name,
      }));
  };

  const { workspaceId } = useParams();
  const filteredTasks = tasks.filter(
    (task) => task.workspaceId === Number(workspaceId)
  );
  const member = getUsersByWorkspaceId(Number(workspaceId));

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={filteredTasks} total={filteredTasks.length} />
        <ProjectList data={projects} total={projects.length} />
        <MemberList data={member} total={member.length} />
      </div>
    </div>
  );
};

export default WorkspaceId;

interface ProjectListProps {
  data: any[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = () => {
    searchParams.set("edit-task", "true");
    setSearchParams(searchParams);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    searchParams.delete("edit-task");
    setSearchParams(searchParams);
  };
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <ProjectModal isOpen={isModalOpen} onClose={closeModal} />
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="default" size="icon" onClick={openModal}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSperator className="my-4" />
        <ul className="grid grid-col-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.id}>
              <Link to={`/workspaces/${workspaceId}/projects/${project.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      classname="size-12"
                      fallbackClassName="text-lg"
                      name={project.name}
                      image={project.imageUrl}
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Projects Found.
          </li>
        </ul>
      </div>
    </div>
  );
};

interface TaskListProps {
  data: any[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const { projects } = useLoaderData();
  const userData = useLoaderData();
  const workspaceId = useWorkspaceId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = () => {
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
    <div className="flex flex-col gap-y-4 col-span-1">
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projects={projects}
        members={userData}
      />
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant="secondary" size="icon" onClick={openModal}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSperator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link to={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Tasks Found.
          </li>
        </ul>
        <Button variant="secondary" className="mt-4 w-full" asChild>
          <Link to={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: any[];
  total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button asChild variant="secondary" size="icon">
            <Link to={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSperator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar classname="size-12" name={member.name} />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Members Found.
          </li>
        </ul>
      </div>
    </div>
  );
};
