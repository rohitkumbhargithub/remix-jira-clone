import { CreateWorkspaceModal } from "~/workspaces/create-workspace-modal";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Nav } from "~/componets/nav";
import { Sidebar } from "~/componets/sidebar";

import { createWorkspaces, getAllMemeber } from "~/utils/workspace.server";
import { getUserSession } from "~/utils/session.server";
import { CreateProjectModal } from "~/projects/context/create-project-modal";
import {  UploadHandler } from "@remix-run/node";
import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
  } from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import { createProject, getProjects, getProjectsByWorkspace } from "~/utils/project.server";
import { authenticator } from "~/utils/auth.server";


export const meta: MetaFunction = () => {
  return [
    { title: "Jira Clone" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const loader = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in"
  });
  const user = await getUserSession(request); 

  const workspaceId = params.workspaceId;
  const projectId = params.projectId;
  const id = Number(workspaceId)
  const members = await getAllMemeber(request);

  const projects = await getProjectsByWorkspace(request, id);
  
  const loggedInUserId = user.id;
  const member = members
    .filter(member => member.userId === loggedInUserId)
    .map(member => member.workspaceId);
  
  const workspace = members
    .filter(member => member.userId === loggedInUserId)
    .map(member => member.workspace);

    const result = members.map(({ workspace, userId }) => ({
      workspace,
      userId,
    }));
  
    const matchedItems = result.filter((item) => item.userId === user.id);
    const workspaces = matchedItems.map((item) => item.workspace);
    const getAllProjects = await getProjects(request);

  return { user, workspace, workspaceId, member, projects, projectId, workspaces, getAllProjects }; 
};


export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.clone().formData();
  let imageUrl = form.get("img");
  const name = form.get("name");
  
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
      createMemoryUploadHandler(),
    );
  
    const formData = await parseMultipartFormData(request, uploadHandler);
    imageUrl = formData.get("img"); 
  } else {
    imageUrl = ""; 
  }
  
  const workspace = {
    name,
    imageUrl,
  };
   
  try {
    const newWorkspace = await createWorkspaces(workspace, request);
    return redirect(`/workspaces/${newWorkspace?.id}`);
  } catch (error) {
    console.error("Error creating workspace:", error);
    return json({ error: error.message }, { status: 400 });
  }
}



export default function ProjectLayout() {
  const { getAllProjects } = useLoaderData();

  return (
    <>
      <div className="min-h-screen">
        <CreateWorkspaceModal />
        <CreateProjectModal/>
        <div className="flex w-full h-full">
          <div className="flex left-0 top-0 hidden lg:block lg:w-[350px] f-full overflow-y-auto">
            <Sidebar projects={getAllProjects} />
          </div>
          <div className="lg w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              <Nav projects={getAllProjects} />

              <main className="h-full py-8 px-6 flex flex-col">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
