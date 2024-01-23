import React, { useState } from "react";
import DeleteButton from "@/app/nav/delete.button";
import { deleteUser } from "@/services/user.service";
import Error from "@/app/nav/error";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { resetAuthState } from '@/redux/slices/auth.slice';

const UserDelete = (id: string) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const handleUserDeletion = async () => {
    setErrorMessage("");
    try {
      await deleteUser(id);
      dispatch(resetAuthState());
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || "An error occurred during user deletion.");
    }
  };

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
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
