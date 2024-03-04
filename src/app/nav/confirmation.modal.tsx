import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type ConfirmationModalProps = {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
};

const ConfirmationModal = ({
  open,
  handleClose,
  onConfirm,
  title,
  description,
}: ConfirmationModalProps) => {
  const { loading } = useSelector((state: RootState) => state.auth);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={style}>
        <div className="flex flex-col">
          <h2 id="confirmation-modal-title" className="text-xl font-bold mb-2">
            {title}
          </h2>
          <p id="confirmation-modal-description" className="text-gray-600">
            {description}
          </p>
          <div className="flex flex-row items-center justify-end mt-5">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="text-blue-600 font-semibold mr-2 px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Confirm
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-500 font-semibold px-2 py-1 border border-gray-500 rounded hover:bg-gray-50 focus:outline-none focus:ring focus:ring-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
