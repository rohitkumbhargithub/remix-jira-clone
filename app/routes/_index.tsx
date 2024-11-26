import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { getAllMemeber } from "~/utils/workspace.server";

import IndexLayout from "./_indexLayout";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export const loader: LoaderFunction = async({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in"
  });

  const members = await getAllMemeber(request);
  const result = members.map(({ workspace, userId }) => ({
    workspace,
    userId
  }));

  const matchedItems = result.filter(item => item.userId === user.id);
  const workspaces = matchedItems.map(item => item.workspace);

  return { user, workspaces };
}

export default function Index() {

  return (
    <>
      <IndexLayout/>
    </>
  );
}
