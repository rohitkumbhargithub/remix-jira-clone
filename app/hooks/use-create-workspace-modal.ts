
import { useState } from "react";

export const useCreateWorkspaceModal = () => {
const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  }
  const closeModal = () => setModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal
  }
};
