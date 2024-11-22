import { useParams } from "@remix-run/react";
import { ResponsiveModal } from "~/componets/ui/responsive-modal";
import { EditTaskForm } from "~/tasks/components/edit-task-form";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  tasks: [];
  projects: [];
  members: [];
}

export default function EditModal({
  isOpen,
  onClose,
  taskId,
  tasks,
  projects,
  members,
}: EditModalProps) {
  const { workspaceId, projectId } = useParams();
  const data = members;
  // console.log(data, "task Modal")

  const id = parseInt(workspaceId, 10);
  const currentWorkspaceId = id; // Use the parsed workspaceId to match the current workspace

  // Filter members that belong to the current workspace
  const membersInCurrentWorkspace = data.members.filter(
    (member) => member.workspaceId === currentWorkspaceId
  );

  // Get the user IDs from the filtered members
  const userIdsInCurrentWorkspace = membersInCurrentWorkspace.map(
    (member) => member.userId
  );

  // Find the user information for these user IDs
  const usersInCurrentWorkspace = data.userData.filter((user) =>
    userIdsInCurrentWorkspace.includes(user.id)
  );

  // Resulting list of users in the current workspace
  const users = usersInCurrentWorkspace;

  return (
    <ResponsiveModal open={isOpen}>
      <EditTaskForm
        onCancel={onClose}
        taskId={taskId}
        tasks={tasks}
        projects={projects}
        members={users}
        actionUrl={`/workspaces/${workspaceId}/projects/${projectId}`}
      />
    </ResponsiveModal>
  );
}
