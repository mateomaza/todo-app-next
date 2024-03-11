import React, { useState } from "react";
import ConfirmationModal from "@/app/nav/confirmation.modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logout } from "@/redux/thunks/auth.thunks";
import { useRouter } from "next/router";
import Error from "./error";

interface DeleteButtonProps {
  onDelete: () => void;
  title: string;
  description: string;
  taskDelete?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  title,
  description,
  taskDelete,
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
      onDelete();
      handleCloseModal();
    } catch (error) {
      await dispatch(logout());
      fetch("/api/logout-session", { method: "POST" })
        .then(() => {
          router.push("/auth/login");
        })
        .catch((error) => {
          console.error(error);
        });
      setErrorMessage("An error occurred during verification.");
    }
  };

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <>
      {taskDelete ? (
        <i
          className="fa-solid fa-trash-can text-gray-500 cursor-pointer"
          onClick={handleOpenModal}
          role="button"
          aria-label="Delete task"
        ></i>
      ) : (
        <button
          onClick={handleOpenModal}
          disabled={loading}
          data-testid="delete-button"
        >
          Delete User
        </button>
      )}

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
