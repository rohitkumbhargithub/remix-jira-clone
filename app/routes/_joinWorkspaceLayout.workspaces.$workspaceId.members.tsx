import { LoaderFunction, redirect } from "@remix-run/node";
import { MetaFunction, useActionData } from "@remix-run/react";
import { json } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { authenticator } from "~/utils/auth.server";
import { getAllUsers } from "~/utils/user.server";
import {
  deleteMemberInWorkspace,
  getAllMemeber,
  updateAsMemberInWorkspace,
} from "~/utils/workspace.server";
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
  });
  const workspaceId = params.workspaceId;
  const members = await getAllMemeber(request);
  const user = await getAllUsers();
  if (!workspaceId) redirect("/");
  return { workspaceId, members, user };
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const memberId = formData.get("memberId");
  const workspaceId = params.workspaceId;

  try {
    if (formData.get("_method") === "DELETE") {
      await deleteMemberInWorkspace(memberId, workspaceId, request);
      return redirect(`/workspaces/${workspaceId}/members`);
    }

    if (formData.get("_method") === "PATCH") {
      await updateAsMemberInWorkspace(memberId, workspaceId, request);
      return redirect(`/workspaces/${workspaceId}/members`);
    }
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
};

const Memebers = () => {
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success); 
    }
  }, [actionData]);

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default Memebers;
