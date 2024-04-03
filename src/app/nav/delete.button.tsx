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
          <svg xmlns="http://www.w3.org/2000/svg" className="icon w-6 h-6" viewBox="0 0 448 512" role="img">
            <path fill="currentColor" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
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
