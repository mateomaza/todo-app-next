import React, { useState } from "react";
import DeleteButton from "@/app/nav/delete.button";
import { deleteUser } from "@/services/user.service";
import ErrorComponent from "@/app/nav/error";

const UserDelete = (id: string) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUserDeletion = async () => {
    setErrorMessage("");
    try {
      await deleteUser(id);
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || "An error occurred during task deletion.");
    }
  };

  if (errorMessage) {
    return <ErrorComponent errorMessage={errorMessage} />;
  }

  return (
    <DeleteButton
      onDelete={handleUserDeletion}
      title="Confirm Account Deletion"
      description="Are you sure you want to delete your account? This action cannot be undone."
    />
  );
};

export default UserDelete;
