// app/routes/workspaces/new.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { NewForm } from "~/workspaces/components/new";
// import { createWorkspace } from "~/models/workspace.server"; // Assume a server function to create workspaces

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Call your database function or model to save the workspace
//   await createWorkspace({ name, description });

  // Redirect to another page after submission
  return redirect("/workspaces/data");
};

export default function NewWorkspaceRoute() {
  return (
    <div>
      <h1>Create a New Workspace</h1>
      <NewForm actionUrl="/workspaces/new" />
    </div>
  );
}
