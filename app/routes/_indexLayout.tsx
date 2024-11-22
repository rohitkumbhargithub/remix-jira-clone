import { CreateWorkspaceModal } from "~/workspaces/create-workspace-modal";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { Nav } from "~/componets/nav";
import { Sidebar } from "~/componets/sidebar";
import { getAllMemeber, getMemeberByWorkspace } from "~/utils/workspace.server";
import { useEffect } from "react";
import { getUserSession } from "~/utils/session.server";
import { CreateProjectModal } from "~/projects/context/create-project-modal";
import { getProjectsByWorkspace } from "~/utils/project.server";
import { authenticator } from "~/utils/auth.server";
import { authenticatorGithub } from "~/utils/github-strategy.server";


export const meta: MetaFunction = () => {
  return [
    { title: "Jira Clone" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const loader = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
      failureRedirect: "/sign-in"
    });
  
  const user = await getUserSession(request); 

  const workspaceId = params.workspaceId;
  const members = await getAllMemeber(request);
  const membersByWorkspace = await getMemeberByWorkspace(request, user.id);
  const workspacesByMembers = membersByWorkspace.map(item => item.workspace);

  const id = Number(workspaceId)

  let projects;

  if(id){
    projects = await getProjectsByWorkspace(request, id);
  }

  const loggedInUserId = user.id;
  const member = members
    .filter(member => member.userId === loggedInUserId)
    .map(member => member.workspaceId);
  
  const workspace = members
    .filter(member => member.userId === loggedInUserId)
    .map(member => member.workspace);

  return { user, workspace, workspaceId, member, projects, workspacesByMembers}; 
};


export default function IndexLayout() {

  const { workspace } = useLoaderData() || {};

  const navigate = useNavigate();

    useEffect(() => {
      if (workspace.length === 0) {
        
        navigate(`/workspaces/create`)
      }else{
        navigate(`/workspaces/${workspace[0].id}`);
      }
    }, []); 



  return (
    <>
      <div className="min-h-screen">
        <CreateWorkspaceModal />
        <CreateProjectModal/>
        <div className="flex w-full h-full">
          <div className="flex left-0 top-0 hidden lg:block lg:w-[350px] f-full overflow-y-auto">
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
