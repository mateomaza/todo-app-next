import React, { useState } from "react";
import ConfirmationModal from "@/app/nav/confirmation.modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { verifyToken } from "@/redux/thunks/auth.thunks";
import { VerifyResponse } from "@/redux/types/auth.types";
import { useRouter } from "next/router";
import ErrorComponent from "./error";

interface DeleteButtonProps {
  onDelete: () => void;
  title: string;
  description: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  title,
  description,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDelete = async () => {
    try {
      const actionResult = await dispatch(verifyToken());
      const verificationResult = actionResult.payload as VerifyResponse;
      if (verificationResult?.verified) {
        onDelete();
        handleCloseModal();
      } else {
        setErrorMessage("Session verification failed. Please log in again.");
        router.push("/auth/login-page");
      }
    } catch (error) {
      setErrorMessage("An error occurred during verification.");
    }
  };

  if (errorMessage) {
    return <ErrorComponent errorMessage={errorMessage} />;
  }

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

export default DeleteButton;
