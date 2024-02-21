import React, { useState } from "react";
import ConfirmationModal from "@/app/nav/confirmation.modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { verifySession } from "@/redux/thunks/auth.thunks";
import { VerifyResponse } from "@/redux/types/auth.types";
import { useRouter } from "next/router";
import Error from "./error";

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
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDelete = async () => {
    try {
      const actionResult = await dispatch(verifySession());
      const verificationResult = actionResult.payload as VerifyResponse;
      if (verificationResult?.verified) {
        onDelete();
        handleCloseModal();
      } else {
        setErrorMessage("Session verification failed. Please log in again.");
        router.push("/auth/login");
      }
    } catch (error) {
      setErrorMessage("An error occurred during verification.");
    }
  };

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <>
      <button onClick={handleOpenModal} disabled={loading} data-testid="delete-button">Delete</button>

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
