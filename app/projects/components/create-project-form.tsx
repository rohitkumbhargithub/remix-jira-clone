import { ImageIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

type CreateProjectFormProps = {
  onCancel: () => void;
  onSuccess: () => void;  // Add an onSuccess prop to close the modal
  actionUrl: string;
};

export const CreateProjectForm = ({
  onCancel,
  onSuccess, // Prop to handle modal close on success
  actionUrl,
}: CreateProjectFormProps) => {
  const inputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigation = useNavigation();
  const isPending = navigation.state === "submitting";

  useEffect(() => {
    if (navigation.state === "idle" && isSubmitted) {
      setImagePreview(null);
      setWorkspaceName("");
      setIsSubmitted(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // Close the modal after form submission
      onSuccess();  // Trigger onSuccess to close the modal
    }
  }, [navigation.state, isSubmitted, onSuccess]);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

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
      console.log(uploaded);
      if (inputRef.current) inputRef.current.value = null;
    } else {
      inputRef.current?.click(); // Open file dialog
    }
  };

  return (
    <div className="w-full h-full border-none shadow-none bg-white rounded-lg p-5">
      <div className="flex p-2 border-b border-gray-200 p-3">
        <h2 className="text-xl font-bold">Create a new Project</h2>
      </div>

      <div className="p-3">
        <Form
          method="post"
          encType="multipart/form-data"
          action={actionUrl}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="projectName" className="font-bold-sm">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                id="projectName"
                placeholder="Enter Project Name"
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
              name="project"
              size="lg"
              disabled={isPending}
              onClick={() => setIsSubmitted(true)}
            >
              Create Project
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
