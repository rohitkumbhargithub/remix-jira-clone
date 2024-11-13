import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { getAllWorkspaces, getJoinedWorkspace } from "~/utils/workspace.server";
import { JoinWorkspaceForm } from "~/workspaces/components/join-workspace";

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
      failureRedirect: "/sign-in",
  })
  const workspaceId = params.workspaceId; 
  const inviteCode = params.inviteCode;
  const workspace = await getAllWorkspaces(request);
  if(!workspaceId) redirect("/");
  return {workspaceId, workspace, inviteCode}
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const joinedWorkspace = await getJoinedWorkspace(params, request);

  if (joinedWorkspace) {
    // Redirect to the index route with the workspace ID
    return redirect(`/workspaces/${joinedWorkspace[0].id}`);
  }

  return joinedWorkspace;
};

const JoinWorkspaces = () => {
  const { workspace, workspaceId } = useLoaderData();

  return (
    <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={{workspaceId}} workspace={workspace}
            />
    </div>
  )
}


export default JoinWorkspaces;