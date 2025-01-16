import { ResponsiveModal } from '~/componets/ui/responsive-modal'; 
import { CreateProjectForm } from '../components/create-project-form';
import { useCreateWorkspaceModal } from '~/hooks/use-create-workspace-modal';
import Modal from '~/componets/modal';
import { useSearchParams } from '@remix-run/react';

export const CreateProjectModal = () => {
  const { isModalOpen, closeModal } = useCreateWorkspaceModal();  
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = searchParams.get("create-project") === "true"; 

  return (
    <ResponsiveModal open={isModalOpen}>
      <Modal isOpen={modal} onClose={closeModal} />
    </ResponsiveModal>
  );
};
