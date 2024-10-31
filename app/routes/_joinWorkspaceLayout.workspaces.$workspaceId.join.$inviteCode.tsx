import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { MemberRole } from "~/features/member/types";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { getUserSession } from "~/utils/session.server";
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

  console.log(joinedWorkspace)

  return joinedWorkspace;
};

const JoinWorkspaces = () => {
  // const workspaceId = useLoaderData();
  const { workspace, workspaceId } = useLoaderData();

  return (
    <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={{workspaceId}} workspace={workspace}
            />
    </div>
  )
}


export default JoinWorkspaces;