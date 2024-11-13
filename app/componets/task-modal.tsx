import { ResponsiveModal } from "~/componets/ui/responsive-modal";
import { useParams } from "@remix-run/react";
import { CreateTaskForm } from "~/tasks/components/create-task-form";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: {};
  members: {};
}

export default function TaskModal({
  isOpen,
  onClose,
  projects,
  members,
}: TaskModalProps) {
  const { workspaceId, projectId } = useParams();
  const data = members;

const id = parseInt(workspaceId, 10);
const currentWorkspaceId = id; // Use the parsed workspaceId to match the current workspace

// Filter members that belong to the current workspace
const membersInCurrentWorkspace = data.members.filter(member => member.workspaceId === currentWorkspaceId);

// Get the user IDs from the filtered members
const userIdsInCurrentWorkspace = membersInCurrentWorkspace.map(member => member.userId);

// Find the user information for these user IDs
const usersInCurrentWorkspace = data.userData.filter(user => userIdsInCurrentWorkspace.includes(user.id));

// Resulting list of users in the current workspace
const users = usersInCurrentWorkspace;


  return (
    <ResponsiveModal open={isOpen}>
      <CreateTaskForm
        onCancel={onClose}
        actionUrl={`/workspaces/${workspaceId}/projects/${projectId}`}
        projects={projects}
        users={users}
      />
    </ResponsiveModal>
  );
}
