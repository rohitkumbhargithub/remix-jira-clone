import { Form, Link, useFetcher, useNavigation } from "@remix-run/react";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { useConfirm } from "~/features/hooks/useConfirm";

import { cn } from "~/lib/utils";

export async function loader({ request }) {
  const url = new URL(request.url);
  const origin = url.origin;
  return { origin };
}

type UpdateWorkspaceFormProps = {
  actionUrl: string;
};

type UpdateWorkspaceProps = {
  onCancel: () => void;
  initialValues: any;
  workspace: any;
} & UpdateWorkspaceFormProps;

export const UpdateWorkspaceForm = ({
  onCancel,
  initialValues,
  workspace,
  actionUrl,
}: UpdateWorkspaceProps) => {
  const inputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission state
  const navigation = useNavigation();
  const isPending = navigation.state === "submitting";
  const data = workspace;
  const id = initialValues;
  const fetcher = useFetcher();
  const workspaceData = data.find((workspace) => workspace.id === id);

  const [name, setName] = useState(workspaceData.name);
  const [image, setImage] = useState(workspaceData.imageUrl);

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

  const handleButtonRemove = () => {
    setUploaded(false);
    setImagePreview(null);
    setImage("");
    if (inputRef.current) inputRef.current.value = null;
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

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite Code Copied to clipboard"));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Code",
    "This will invalidate the current invite link",
    "destructive"
  );

  const handleResetInviteCode = async (event) => {
    event.preventDefault();
    const confirmed = await confirmReset();
    if (confirmed) {
      fetcher.submit(event.target, { method: "post" });
    }
  };

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

  const fullInviteLink = `https://project-management-ucvk.onrender.com/workspaces/${initialValues}/join/${workspaceData.inviteCode}`;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Link to={`/workspaces/${id}`}>
            <Button size="sm" variant="secondary">
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
          </Link>
          <CardTitle className="text-xl font-bold">
            {workspaceData.name}
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
                <label htmlFor="workspaceName" className="font-bold">
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="workspaceName"
                  name="workspaceName"
                  placeholder="Enter Workspace Name"
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
                    <p className="text-sm">Workspace Icon</p>
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
                        onClick={handleButtonRemove}
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
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Invite Member</h3>
              <p className="text-sm text-muted-foreground">
                Use the invite link to add memebers to your workspace
              </p>
              <div className="mt-4">
                <div className="flex items-center gap-x-2">
                  <Input disabled value={fullInviteLink} />
                  <Button
                    onClick={handleCopyInviteLink}
                    variant="secondary"
                    className="size-10"
                  >
                    <CopyIcon />
                  </Button>
                </div>
              </div>
              <DottedSperator className="py-7" />

              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="outline"
                type="submit"
                onClick={handleResetInviteCode}
                name="reset"
                value="reset"
                // disabled={isPending || isResettingInviteCode  }
              >
                Reset Invite Link
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full h-full border-none shadow-none mt-6">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting a workspace is irrevesible and will remove all
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
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
};
