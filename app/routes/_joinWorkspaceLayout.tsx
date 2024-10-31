import UserButton from "~/componets/user-button";

import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";
import WorkspaceSetting from "./_workspaceLayout.workspaces.$workspaceId.settings";
import { getWorkspacesByUser } from "~/utils/workspace.server";



export const loader = async ({ request }) => {
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
                    <Link to="/">
                        {/* <Image /> */}
                        <h1>LOGO</h1>
                    </Link>
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
