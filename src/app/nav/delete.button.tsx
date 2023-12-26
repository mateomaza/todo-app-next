import React, { useState } from "react";
import ConfirmationModal from "@/app/nav/confirmation.modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { verifyToken } from "@/redux/thunks/auth.thunks";

interface DeleteButtonProps {
  onDeleteConfirm: () => void;
  title: string;
  description: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDeleteConfirm, title, description }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDelete = () => {
    dispatch(verifyToken())
    onDeleteConfirm();
    handleCloseModal();
  };

  return (
    <>
      <button onClick={handleOpenModal}>Delete</button>

      <ConfirmationModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onConfirm={handleDelete}
        title={title}
        description={description}
      />
    </>
  );
};
