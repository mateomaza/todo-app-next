import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ErrorSnackbarProps {
    open: boolean;
    handleClose: () => void;
    errorMessage: string;
  }

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ open, handleClose, errorMessage }) => {
  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert severity="error">{errorMessage}</Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
