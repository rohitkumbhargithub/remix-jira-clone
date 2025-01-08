import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
    redirect,
    UploadHandler,
    ActionFunctionArgs,
  } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import UserButton from "~/componets/user-button";
import { generateInviteCode } from "~/lib/utils";
import { authenticator } from "~/utils/auth.server";
import { uploadImage } from "~/utils/cloudinary.server";
import { getUserSession } from "~/utils/session.server";
import { createWorkspaces, getAllMemeber, getMemeberByWorkspace, getWorkspacesByUser } from "~/utils/workspace.server";
import { CreateWorkspaceForm } from "~/workspaces/components/create-workspace";


export const loader = async ({ request, params }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/sign-in",
    }) 
    const user = await getUserSession(request);
    
      const workspaceId = params.workspaceId;
      const members = await getAllMemeber(request);
      const membersByWorkspace = await getMemeberByWorkspace(request, user.id);
      const workspacesByMembers = membersByWorkspace.map((item) => item.workspace);
      const result = members.map(({ workspace, userId }) => ({
        workspace,
        userId,
      }));
    
      const matchedItems = result.filter((item) => item.userId === user.id);
      const workspaces = matchedItems.map((item) => item.workspace);
    return { user, workspaces, workspaceId }; 
};


export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.clone().formData();
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
      console.log(formData)
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
      return json({ error: error.message }, { status: 400 });
    }
  };

const WorkspaceCreate = () => {
    const { user, workspaces, workspaceId} = useLoaderData() || {};
    console.log(workspaces);

    const navigate = useNavigate();
    
      useEffect(() => {
        if (workspaces.length === 0) {
          navigate(`/workspaces/create`);
        } else if(workspaceId) {
          navigate(`/workspaces/${workspaceId}`);
        } else {
          navigate(`/workspaces/${workspaces[0].id}`);
        }
      }, [workspaceId, navigate]);
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center h-[73px]">
                    <Link to="/">
                        {/* <Image /> */}
                        <h1>LOGO</h1>
                    </Link>
                    <UserButton />
                </nav>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
                <div className="w-full lg:max-w-xl">
                    <CreateWorkspaceForm/>
                </div>
            </div>
        </main>
    )
}

export default WorkspaceCreate;