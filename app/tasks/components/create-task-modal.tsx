import { ResponsiveModal } from '~/componets/ui/responsive-modal'; 
import { useCreateWorkspaceModal } from '~/hooks/use-create-workspace-modal';

import TaskModal from '~/componets/task-modal';
import { useSearchParams } from '@remix-run/react';

export const CreateWorkspaceModal = () => {
  const { isModalOpen, closeModal } = useCreateWorkspaceModal();  
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = searchParams.get("create-task") === "true"; 
  const handleCloseModal = () => {
    searchParams.delete("create-task");
    setSearchParams(searchParams); 
    closeModal(); 
  };

  return (
    <ResponsiveModal open={modal}>
      <TaskModal isOpen={modal} onClose={handleCloseModal} />
    </ResponsiveModal>
  );
};
