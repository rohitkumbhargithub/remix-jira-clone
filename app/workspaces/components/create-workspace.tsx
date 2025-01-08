import { ImageIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

type CreateWorkspaceFormProps = {
  onCancel: () => void;
  actionUrl: string;
};

export const CreateWorkspaceForm = ({
  onCancel,
  actionUrl,
}: CreateWorkspaceFormProps) => {
  const inputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission state
  const navigation = useNavigation();
  const isPending = navigation.state === "submitting";

  try {
    useEffect(() => {
      if (navigation.state === "idle" && isSubmitted) {
        setImagePreview(null);
        setWorkspaceName("");
        setIsSubmitted(false);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }, [navigation.state, isSubmitted]);
  } catch (error) {
    toast.error("Error to create Workspace!");
  }

  const [uploaded, setUploaded] = useState(false);
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
    if (event.target.files && event.target.files.length > 0) {
      setUploaded(true); // Set uploaded to true when file is selected
    }
  };

  const handleButtonClick = () => {
    if (uploaded) {
      setUploaded(false); // Remove image and reset input
      setImagePreview(null);
      if (inputRef.current) inputRef.current.value = null;
    } else {
      inputRef.current?.click(); // Open file dialog
    }
  };

  return (
    <div className="w-full h-full border-none shadow-none bg-white rounded-lg p-5">
      <div className="flex p-2 border-b border-gray-200 p-3">
        <h2 className="text-xl font-bold">Create a new workspace</h2>
      </div>

      <div className="p-3">
        <Form method="post" encType="multipart/form-data" action={actionUrl}>
          <div className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="workspaceName" className="font-bold-sm">
                Workspace Name
              </label>
              <input
                type="text"
                id="workspaceName"
                name="workspaceName"
                placeholder="Enter Workspace Name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
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
                  <Avatar className="size-[72px]">
                    <AvatarFallback>
                      <ImageIcon className="size-[36px] text-neutral-500" />
                    </AvatarFallback>
                  </Avatar>
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
                    onChange={handleUpload}
                  />
                  {uploaded ? (
                    <Button
                      type="button"
                      className="mt-2 w-fit px-4 py-2 rounded-md"
                      variant="destructive"
                      onClick={handleButtonClick}
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
          </div>

          <div className="py-3" />

          <DottedSperator className="py-7" />
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
              className={cn(onCancel ? "visible" : "invisible")}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              name="My Workspace"
              size="lg"
              disabled={isPending}
            >
              Create Workspace
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
