import { LoaderFunction, redirect } from "@remix-run/node";
import { MetaFunction } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { getAllUsers } from "~/utils/user.server";
import { deleteMemberInWorkspace, getAllMemeber, updateAsMemberInWorkspace } from "~/utils/workspace.server";
import { MembersList } from "~/workspaces/components/members-list";


export const meta: MetaFunction = () => {
  return [
    { title: "Workspaces Members" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};


export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
      failureRedirect: "/sign-in",
  })
  const workspaceId = params.workspaceId; 
  const members = await getAllMemeber(request);
  const user = await getAllUsers();
  if(!workspaceId) redirect("/");
  return {workspaceId, members, user}
};


export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const memberId = formData.get("memberId");
  const workspaceId = params.workspaceId;

  if (formData.get("_method") === "DELETE"){
    await deleteMemberInWorkspace(memberId, workspaceId, request);
  }

  if (formData.get("_method") === "PATCH"){
    await updateAsMemberInWorkspace(memberId, workspaceId, request);
  }


  return { error: "Invalid action or missing data" };
};


const Memebers = () => {
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  )
}



export default Memebers;