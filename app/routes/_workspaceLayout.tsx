import UserButton from "~/componets/user-button";

import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";
import WorkspaceSetting from "./_workspaceLayout.workspaces.$workspaceId.settings";
import { getAllMemeber } from "~/utils/workspace.server";
import { authenticator } from "~/utils/auth.server";



export const loader = async ({ request }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/sign-in"
      });
    const user = await getUserSession(request); 
    const members = await getAllMemeber(request);
    const loggedInUserId = user.id;
  const workspace = members
    .filter(member => member.userId === loggedInUserId)
    .map(member => member.workspace);

    return { user, workspace }; 
};


const WorkspaceLayout = () => {
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
                <WorkspaceSetting workspace={workspace}/>
            </div>
        </main>
    );
};

export default WorkspaceLayout;
