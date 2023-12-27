import React from "react";
import Alert from "@mui/material/Alert";

type ErrorProps = {
  errorMessage: string;
};

const Error: React.FC<ErrorProps> = ({errorMessage}) => {
  return <Alert severity="error">{errorMessage}</Alert>;
};

export default Error;
