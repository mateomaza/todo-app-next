import React, { useState, useImperativeHandle, forwardRef } from "react";
import ConfirmationModal from "@/app/nav/confirmation.modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logout } from "@/redux/thunks/auth.thunks";
import { useRouter } from "next/router";
import Error from "./error";
import Loading from "./loading";

interface DeleteButtonProps {
  onDelete: () => void;
  title: string;
  description: string;
  taskDelete?: boolean;
  noText?: boolean;
}

export interface DeleteButtonHandle {
  openModal: () => void;
}

const DeleteButton: React.ForwardRefRenderFunction<
  DeleteButtonHandle,
  DeleteButtonProps
> = ({ onDelete, title, description, taskDelete, noText }, ref) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useImperativeHandle(ref, () => ({
    openModal: handleOpenModal,
  }));

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
    }
  };

  return (
    <>
      {taskDelete ? (
        <button aria-label="Delete task" onClick={handleOpenModal} className="text-gray-500 cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" role="img">
            <path d="M512 64V288H64L64 64H512zM64 0C28.7 0 0 28.7 0 64V288c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM0 448v32c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zm192-32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V448c0-17.7-14.3-32-32-32H192zm128 32v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V448c0-17.7-14.3-32-32-32H352c-17.7 0-32 14.3-32 32zm192-32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V448c0-17.7-14.3-32-32-32H512z"/>
          </svg>
        </button>
      ) : (
        <button
          onClick={handleOpenModal}
          disabled={loading}
          data-testid="delete-button"
        >
          {noText ? "" : "Delete User"}
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

export default forwardRef(DeleteButton);
