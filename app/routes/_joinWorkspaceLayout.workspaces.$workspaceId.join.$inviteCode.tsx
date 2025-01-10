import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { authenticator } from "~/utils/auth.server";
import { getAllWorkspaces, getJoinedWorkspace } from "~/utils/workspace.server";
import { JoinWorkspaceForm } from "~/workspaces/components/join-workspace";

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });
  const workspaceId = params.workspaceId;
  const inviteCode = params.inviteCode;
  const workspace = await getAllWorkspaces(request);
  if (!workspaceId) redirect("/");
  return { workspaceId, workspace, inviteCode };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const joinedWorkspace = await getJoinedWorkspace(params, request);
    return redirect(`/workspaces/${joinedWorkspace[0].id}`);
  } catch (error) {
    console.error("Error creating project:", error);
    return json({ error: error.message }, { status: 400 });
  }

};

const JoinWorkspaces = () => {
  const { workspace, workspaceId } = useLoaderData();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success); 
    }
  }, [actionData]);

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initialValues={{ workspaceId }}
        workspace={workspace}
      />
    </div>
  );
};

export default JoinWorkspaces;
