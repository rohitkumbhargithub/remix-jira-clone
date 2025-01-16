import { ResponsiveModal } from "~/componets/ui/responsive-modal"; 
import { useParams } from "@remix-run/react";
import { CreateProjectForm } from "~/projects/components/create-project-form";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const { workspaceId } = useParams();

  const handleSuccess = () => {
    // Close the modal when form submission is successful
    onClose();
  };

  return (
    <ResponsiveModal open={isOpen}>
      <CreateProjectForm onCancel={onClose} onSuccess={handleSuccess} actionUrl={`/workspaces/${workspaceId}`} />
    </ResponsiveModal>
  );
}
