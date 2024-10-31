import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
    redirect,
    UploadHandler,
    ActionFunctionArgs,
  } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import UserButton from "~/componets/user-button";
import { generateInviteCode } from "~/lib/utils";
import { authenticator } from "~/utils/auth.server";
import { uploadImage } from "~/utils/cloudinary.server";
import { getUserSession } from "~/utils/session.server";
import { createWorkspaces, getWorkspacesByUser } from "~/utils/workspace.server";
import { CreateWorkspaceForm } from "~/workspaces/components/create-workspace";


export const loader = async ({ request }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/sign-in",
    })
    const user = await getUserSession(request); 
    const workspace = await getWorkspacesByUser(request);
    return { user, workspace }; 
};


export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.clone().formData();
    let imageUrl = form.get("img") || null;
    const name = form.get("name");
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
  };

const WorkspaceCreate = () => {
    const { user, workspace } = useLoaderData() || {};
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