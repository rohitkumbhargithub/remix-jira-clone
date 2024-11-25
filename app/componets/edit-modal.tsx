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

  const id = parseInt(workspaceId, 10);
  const currentWorkspaceId = id; 

  
  const membersInCurrentWorkspace = data.members.filter(
    (member) => member.workspaceId === currentWorkspaceId
  );

  
  const userIdsInCurrentWorkspace = membersInCurrentWorkspace.map(
    (member) => member.userId
  );

  
  const usersInCurrentWorkspace = data.userData.filter((user) =>
    userIdsInCurrentWorkspace.includes(user.id)
  );

 
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
