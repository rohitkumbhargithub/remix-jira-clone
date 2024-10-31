import { CreateWorkspaceModal } from "~/workspaces/create-workspace-modal";
import { Outlet, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Nav } from "~/componets/nav";
import { Sidebar } from "~/componets/sidebar";

import { getAllWorkspaces, getJoinedWorkspace, getWorkspacesByUser } from "~/utils/workspace.server";
import { useEffect } from "react";
import { getUserSession } from "~/utils/session.server";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request, params }) => {
  const user = await getUserSession(request); 
  const workspace = await getWorkspacesByUser(request);
  const workspaceId = params.workspaceId;
  return { user, workspace, workspaceId }; 
};

export default function IndexLayout() {

  const { user, workspace } = useLoaderData() || {};

  const navigate = useNavigate();
  useEffect(() => {
    if (workspace.length > 0) {
      navigate(`/workspaces/${workspace[0].id}`);
    }else{
      navigate(`/workspaces/create`);
    }
  }, []); 

  return (
    <>
      <div className="min-h-screen">
        <CreateWorkspaceModal />

        <div className="flex w-full h-full">
          <div className="flex left-0 top-0 hidden lg:block lg:w-[264px] f-full overflow-y-auto">
            <Sidebar />
          </div>
          <div className="lg w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              <Nav />

              <main className="h-full py-8 px-6 flex flex-col">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
