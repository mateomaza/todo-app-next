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
        <h2 id="confirmation-modal-title">{title}</h2>
        <p id="confirmation-modal-description">{description}</p>
        <div>
          <button onClick={onConfirm} disabled={loading}>
            Confirm
          </button>
          <button onClick={handleClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
