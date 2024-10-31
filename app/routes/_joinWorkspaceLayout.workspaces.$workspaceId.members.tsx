import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { getAllUsers } from "~/utils/user.server";
import { getAllMemeber } from "~/utils/workspace.server";
import { MembersList } from "~/workspaces/components/members-list";

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

const Memebers = () => {
  
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  )
}



export default Memebers;