import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { Task } from "../types";
import { Form, useNavigation } from "@remix-run/react";
import { toast } from "sonner"; // Import the toast function

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task?.description);
  const navigation = useNavigation();

  const isSaving = navigation.state === "submitting";

  const handleSave = () => {
    toast.success("Description saved!");
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? <XIcon className="size-4 mr-2" /> : <PencilIcon className="size-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSperator className="my-4" />
      {isEditing ? (
        <Form
          method="post"
          onSubmit={() => {
            setIsEditing(false);
            handleSave();
          }} 
        >
          <div className="flex flex-col gap-y-4">
            <Textarea
              placeholder="Add a description..."
              value={value}
              name="description"
              rows={4}
              onChange={(e) => setValue(e.target.value)}
              disabled={isSaving}
            />
            <Button
              size="sm"
              className="w-fit ml-auto"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      ) : (
        <div>
          {task?.description || (
            <span className="text-muted-foreground">No Description Set</span>
          )}
        </div>
      )}
    </div>
  );
};
