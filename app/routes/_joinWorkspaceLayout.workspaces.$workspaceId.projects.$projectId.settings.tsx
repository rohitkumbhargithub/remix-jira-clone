import {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
  UploadHandler,
} from "@remix-run/node";
import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";

import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { EditProjectForm } from "~/projects/components/edit-project-form";
import {
  DeleteProject,
  getProjectsByWorkspace,
  removeImage,
  UpdateProject,
} from "~/utils/project.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Project Settings" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });

  const workspaceId = params.workspaceId;
  const projectId = params.projectId;
  const projects = await getProjectsByWorkspace(request, Number(workspaceId));
  return { workspaceId, projects, projectId };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const workspaceId = params.workspaceId;
  const projectId = params.projectId;

  const form = await request.clone().formData();
  const deleteAction = form.get("delete");

  if (deleteAction === "delete") {
    try {
      await DeleteProject(Number(projectId), request);
      return redirect(`/workspaces/${workspaceId}?success=Project%20deleted`);
    } catch (error) {
      return json({ error: "Failed to delete project." }, { status: 400 });
    }
  }

  if (form.get("_method") === "DELETE") {
    const removeImageId = form.get("remove-image");
    const workspaceId = form.get("workspaceId");
    await removeImage(request, Number(workspaceId), Number(removeImageId));
  }

  let imageUrl = form.get("img");
  const name = form.get("projectName");

  if (!name) {
    return json({ error: "Project name is required." }, { status: 400 });
  }

  if (imageUrl && imageUrl.size > 0) {
    const uploadHandler: UploadHandler = composeUploadHandlers(
      async ({ name, data }) => {
        if (name !== "img") {
          return undefined;
        }

        const uploadedImage = await uploadImage(data);
        return uploadedImage.secure_url;
      },
      createMemoryUploadHandler()
    );

    const formData = await parseMultipartFormData(request, uploadHandler);
    imageUrl = formData.get("img");
  }

  const project = { name, imageUrl };

  try {
    await UpdateProject(project, projectId, request);
    return redirect(`/workspaces/${workspaceId}/projects/${projectId}?success=Project%20Updated`);
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
};

const ProjectSettings = () => {
  const { projects, workspaceId, projectId } = useLoaderData();
  if (!projectId) {
    return redirect(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success); // Use toast.success for success messages
    }
  }, [actionData]);

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm
        initialValues={projectId}
        projectsData={projects}
        actionUrl={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
      />
    </div>
  );
};

export default ProjectSettings;
