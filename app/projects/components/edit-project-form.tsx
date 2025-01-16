import {
  Form,
  Link,
  useFetcher,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {
  ArrowLeftIcon,
  ImageIcon,
  MonitorCog,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { useConfirm } from "~/features/hooks/useConfirm";
import { useProjectId } from "~/hooks/user-projectId";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

import { cn } from "~/lib/utils";

type EditProjectFormProps = {
  actionUrl: string;
};

type EditProjectProps = {
  onCancel: () => void;
  initialValues: any;
  projectsData: any;
} & EditProjectFormProps;

export const EditProjectForm = ({
  onCancel,
  initialValues,
  projectsData,
  actionUrl,
}: EditProjectProps) => {
  const inputRef = useRef(null);
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const navigation = useNavigation();
  const isPending = navigation.state === "submitting";
  const id = Number(initialValues);

  const fetcher = useFetcher();

  const projectData = projectsData.find((project) => project.id === id);

  const [name, setName] = useState(projectData.name);
  const [image, setImage] = useState(projectData.imageUrl);

  const [uploaded, setUploaded] = useState(false);
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
    if (event.target.files && event.target.files.length > 0) {
      setUploaded(true);
    }
  };

  const handleButtonRemove = async (actionValue) => {
    setUploaded(false);
    setImagePreview(null);
    setImage("");
    if (inputRef.current) inputRef.current.value = null;

    const formData = new FormData();
    formData.append("_method", "DELETE");
    formData.append(actionValue, projectId);
    formData.append("workspaceId", workspaceId);

    await fetch(`/workspaces/${workspaceId}/projects/${projectId}/settings`, {
      method: "POST",
      body: formData,
    });
    navigate(`/workspaces/${workspaceId}/projects/${projectId}/settings`);
  };

  const handleButtonClick = () => {
    if (image) {
      setUploaded(false);
      setImagePreview(null);
      setImage("");
      if (inputRef.current) inputRef.current.value = null;
    } else {
      inputRef.current?.click();
      setImage(image);
    }
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone",
    "destructive"
  );

  const handleDelete = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const confirmed = await confirmDelete();
    if (confirmed) {
      fetcher.submit(event.target, { method: "post" });
    }
  };

  useEffect(() => {
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    } else if (fetcher.data?.success) {
      toast.success(fetcher.data.success);
    }
  }, [fetcher.data]);

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Link
            to={`/workspaces/${projectData.workspaceId}/projects/${projectData.id}`}
          >
            <Button size="sm" variant="secondary">
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="inline-flex items-center">
            <MonitorCog />
          </div>
          <CardTitle className="text-xl font-bold">
            {projectData.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSperator />
        </div>
        <CardContent className="p-7">
          <Form
            method="post"
            encType="multipart/form-data"
            action={actionUrl}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-y-4">
              <div>
                <label htmlFor="projectName" className="font-bold">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="Enter Project Name"
                  value={name}
                  onChange={handleChangeName}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-5">
                  {imagePreview ? (
                    <div className="w-[100px] relative rounded-md overflow-hidden">
                      <img
                        alt="Logo"
                        className="object-cover w-full h-full"
                        src={imagePreview}
                      />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          className="rounded-sm"
                          alt="Workspace Icon"
                        />
                      ) : (
                        <div className="w-[72px] h-[72px] bg-gray-100 rounded-full flex items-center justify-center">
                          <ImageIcon className="text-gray-500 w-[36px] h-[36px]" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="text-sm">Project Icon</p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, SVG or JPEG, max 1mb
                    </p>
                    <input
                      type="file"
                      name="img"
                      accept=".jpg, .png, .jpeg, .svg"
                      className="hidden"
                      ref={inputRef}
                      onChange={handleImageChange}
                    />
                    {image ? (
                      <Button
                        type="button"
                        className="mt-2 w-fit px-4 py-2 rounded-md"
                        variant="destructive"
                        name="remove"
                        value="remove-image"
                        onClick={() => handleButtonRemove("remove-image")}
                        disabled={isPending}
                      >
                        Remove Image
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="mt-2 w-fit px-4 py-2 rounded-md bg-blue-500"
                        onClick={handleButtonClick}
                        disabled={isPending}
                      >
                        Upload Image
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <DottedSperator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onCancel}
                  className={cn(onCancel ? "visible" : "invisible")}
                  //  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" size="lg" onClick={handleSubmit}>
                  Save the Changes
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
      <Form method="post" action={actionUrl}>
        <Card className="w-full h-full border-none shadow-none mt-6">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <div className="inline-flex items-center">
                <TriangleAlert />
                <h3 className="font-bold m-2"> Danger Zone</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Deleting a project is irrevesible and will remove all
                assocaiated data
              </p>
              <DottedSperator className="py-7" />

              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="submit"
                onClick={handleDelete}
                name="delete"
                value="delete"
              >
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
};
