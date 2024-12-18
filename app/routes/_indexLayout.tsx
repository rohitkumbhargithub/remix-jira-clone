import { CreateWorkspaceModal } from "~/workspaces/create-workspace-modal";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { Nav } from "~/componets/nav";
import { Sidebar } from "~/componets/sidebar";
import { getAllMemeber, getMemeberByWorkspace } from "~/utils/workspace.server";
import { useEffect, useState } from "react";
import { getUserSession } from "~/utils/session.server";
import { CreateProjectModal } from "~/projects/context/create-project-modal";
import { getProjects, getProjectsByWorkspace } from "~/utils/project.server";
import { authenticator } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Jira Clone" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const loader = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });

  const user = await getUserSession(request);

  const workspaceId = params.workspaceId;
  const members = await getAllMemeber(request);
  const membersByWorkspace = await getMemeberByWorkspace(request, user.id);
  const workspacesByMembers = membersByWorkspace.map((item) => item.workspace);
  const result = members.map(({ workspace, userId }) => ({
    workspace,
    userId,
  }));

  const matchedItems = result.filter((item) => item.userId === user.id);
  const workspaces = matchedItems.map((item) => item.workspace);

  const id = Number(workspaceId);

  let projects;

  if (id) {
    projects = await getProjectsByWorkspace(request, id);
  }

  const getAllProjects = await getProjects(request);



  return { user, workspaceId, projects, workspacesByMembers, workspaces, getAllProjects };
};

export default function IndexLayout() {
  const { workspaceId, projects, workspacesByMembers, workspaces, getAllProjects } =
    useLoaderData() || {};
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(
    Number(workspaceId)
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (workspaces.length === 0) {
      navigate(`/workspaces/create`);
    } else if(workspaceId) {
      navigate(`/workspaces/${workspaceId}`);
    } else {
      navigate(`/workspaces/${workspaces[0].id}`);
    }
  }, [workspaceId, navigate]);

  return (
    <>
      <div className="min-h-screen">
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <div className="flex w-full h-full">
          <div className="flex left-0 top-0 hidden lg:block lg:w-[350px] f-full overflow-y-auto">
            <Sidebar
              projects={getAllProjects}
            />
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
