import type { ActionFunctionArgs, LoaderFunction, MetaFunction, UploadHandler } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { createWorkspaces, getWorkspacesByUser } from "~/utils/workspace.server";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
} from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import IndexLayout from "./_indexLayout";
import { generateInviteCode } from "~/lib/utils";

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

  const workspace = await getWorkspacesByUser(request);

  return { user, workspace };
}

export default function Index() {


  return (
    <>
      <IndexLayout/>
    </>
  );
}
