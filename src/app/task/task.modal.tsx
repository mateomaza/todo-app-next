import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

type TaskModalProps = {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

const TaskModal = ({ open, handleClose, children }: TaskModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="task-modal-title"
      aria-describedby="task-modal-description"
    >
      <Box sx={style}>
        {children}
      </Box>
    </Modal>
  );
};

export default TaskModal;