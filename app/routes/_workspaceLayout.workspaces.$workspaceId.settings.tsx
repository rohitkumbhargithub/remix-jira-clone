import {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
  UploadHandler,
} from "@remix-run/node";
import { redirect, useActionData, useParams } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { UpdateWorkspaceForm } from "~/workspaces/components/update-workspace";

import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import {
  UpdateWorkspace,
  DeleteWorkspace,
  getWorkspacesByUser,
  ResetCode,
} from "~/utils/workspace.server";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { generateInviteCode } from "~/lib/utils";
import { Toaster } from "~/components/ui/sonner";

export const meta: MetaFunction = () => {
  return [
    { title: "Workspace Settings" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });
  const workspaceId = params.workspaceId;
  return workspaceId;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const workspaceId = params.workspaceId;
  const form = await request.clone().formData();
  
    const resetAction = form.get("reset");
    const deleteAction = form.get("delete");
    if(resetAction === "reset"){
      try{ 
        return await ResetCode({workspaceId}, request);
        
      } catch (error) {
        console.error("Error reseting code:", error);
        return json({ error: "Failed to reset code." }, { status: 400 });
      }
    }
  
    if (deleteAction === "delete") {
      try {
        await DeleteWorkspace(workspaceId, request);
        const workspace = await getWorkspacesByUser(request);
        if(workspace.length === 0){
          return redirect(`/workspaces/create`);
        }
        return redirect(`/workspaces/${workspace[0].id}`);
      } catch (error) {
        console.error("Error deleting workspace:", error);
        return json({ error: "Failed to delete workspace." }, { status: 400 });
      }
    }
  
  
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
    }else{
      imageUrl = "";
    }
    
  
    const workspaceData = { name, imageUrl };
  
    try {
      await UpdateWorkspace(workspaceData, workspaceId, request);
      return redirect(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error("Error updating workspace:", error);
      return json({ error: error.message }, { status: 400 });
    }
};

const WorkspaceSetting = ({ workspace }) => {
  const workspaceIdParams = useParams();
  const jsonString = JSON.stringify(workspaceIdParams);
  const parsedData = JSON.parse(jsonString);
  const workspaceId = parseInt(parsedData.workspaceId, 10);

  if (!workspaceId) {
    return redirect(`/workspaces/${workspaceId}`);
  }

  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success); // Use toast.success for success messages
    }
  }, [actionData]);

  return (
    <div className="w-full lg:max-w-xl">
      <Toaster/>
      <UpdateWorkspaceForm
        initialValues={workspaceId}
        workspace={workspace}
        actionUrl={`/workspaces/${workspaceId}/settings`}
      />
    </div>
  );
};

export default WorkspaceSetting;
