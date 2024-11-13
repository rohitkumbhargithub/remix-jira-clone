import { CreateWorkspaceForm } from "~/workspaces/components/create-workspace";
import { ResponsiveModal } from "~/componets/ui/responsive-modal"; 
import { useParams } from "@remix-run/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const { workspaceId } = useParams();
  return (
    <ResponsiveModal open={isOpen}>
        <CreateWorkspaceForm onCancel={onClose} actionUrl={`/workspaces/${workspaceId}`}/>
    </ResponsiveModal>
  );
}
