import UserButton from "~/componets/user-button";

import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";
import { getWorkspacesByUser } from "~/utils/workspace.server";
import { authenticator } from "~/utils/auth.server";




export const loader = async ({ request, params }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/sign-in"
      });
    const workspaceId = params.workspaceId;
    const id = Number(workspaceId)
    const user = await getUserSession(request); 
    const workspace = await getWorkspacesByUser(request);
    
    return { user, workspace }; 
};


const WorkspaceLayout = () => {
    const { user, workspace } = useLoaderData() || {};
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center h-[73px]">
                    
                        {/* <Image /> */}
                        <h1>LOGO</h1>
                   
                    <UserButton />
                </nav>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
                <Outlet/>
            </div>
        </main>
    );
};

export default WorkspaceLayout;
