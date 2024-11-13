import { LoaderFunction, ActionFunctionArgs, UploadHandler } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { createWorkspaces } from "~/utils/workspace.server";
import { redirect, useLoaderData, useParams } from "@remix-run/react";
import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
  } from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import { generateInviteCode } from "~/lib/utils";
import { createProject, getProjectsByWorkspace } from "~/utils/project.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/sign-in",
    })
    const workspaceId = params.workspaceId; 
    const id = Number(workspaceId)
    let projects;
    if(id){
      projects = await getProjectsByWorkspace(request, id);
    }

    return { workspaceId, projects }
  };

  export const action = async ({ request, params }: ActionFunctionArgs) => {
    const form = await request.clone().formData();
    
    const workspaceId = params.workspaceId;
    const isWorkspaceForm = form.has("workspaceName");
    
    if(isWorkspaceForm){
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
        inviteCode,
      };

      try {
        const newWorkspace = await createWorkspaces(workspace, request);
        return redirect(`/workspaces/${newWorkspace?.id}`);
      } catch (error) {
        console.error("Error creating workspace:", error);
        return json({ error: error.message }, { status: 400 });
      }
    }

    
    const isProjectForm = form.has("projectName"); 
    if(isProjectForm){
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
          createMemoryUploadHandler(),
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
    
  }

const WorkspaceId = () => {
    const { workspaceId } = useLoaderData();

    return (
        <>
        <h1>workspace ID {workspaceId}</h1>
        
        </>
    )
}

export default WorkspaceId;