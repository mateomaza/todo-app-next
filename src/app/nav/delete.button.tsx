import React, { useState } from "react";
import ConfirmationModal from "@/app/nav/confirmation.modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { verifyToken } from "@/redux/thunks/auth.thunks";

interface DeleteButtonProps {
  onDelete: () => void;
  title: string;
  description: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, title, description }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDelete = () => {
    dispatch(verifyToken())
    onDelete();
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

export default DeleteButton