import { ResponsiveModal } from "~/componets/ui/responsive-modal";
import { EditTaskForm } from "~/tasks/components/edit-task-form";


interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditModal({
  isOpen,
}: EditModalProps) {



  return (
    <ResponsiveModal open={isOpen}>
        <EditTaskForm
      />
    </ResponsiveModal>
  );
}
