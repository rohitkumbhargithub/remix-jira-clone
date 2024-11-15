import { useParams } from "@remix-run/react";
import { ResponsiveModal } from "~/componets/ui/responsive-modal";
import { EditTaskForm } from "~/tasks/components/edit-task-form";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  tasks: [];
  projects: [];
}

export default function EditModal({
  isOpen,
  onClose,
  taskId,
  tasks,
  projects,
}: EditModalProps) {
  const { workspaceId, projectId } = useParams();

  return (
    <ResponsiveModal open={isOpen}>
      <EditTaskForm
        onCancel={onClose}
        taskId={taskId}
        tasks={tasks}
        projects={projects}
        actionUrl={`/workspaces/${workspaceId}/projects/${projectId}`}
      />
    </ResponsiveModal>
  );
}
