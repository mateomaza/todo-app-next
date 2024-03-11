import React, { useState } from "react";
import DeleteButton from "@/app/nav/delete.button";
import { deleteUser } from "@/services/user.service";
import Error from "@/app/nav/error";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/router";

const UserDelete = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { UserObjectId } = useSelector((state: RootState) => state.auth);

  const handleUserDeletion = async () => {
    setErrorMessage("");
    try {
      if (UserObjectId) {
        await deleteUser(UserObjectId);
        fetch("/api/logout-session", { method: "POST" })
          .then(() => {
            router.push("/auth/register");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || "An error occurred during user deletion.");
    }
  };

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <div className="sidebar flex flex-col justify-end mr-5 py-4 px-9 bg-slate-300 border-r-2 border-gray-500 fixed min-h-screen">
      <div className="flex flex-row items-center justify-center border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-2 py-2 rounded-[4px] cursor-pointer">
        <i className="fa-solid fa-user-slash text-[16px] text-gray-400 mr-2 hover:text-white"></i>
        <DeleteButton
          onDelete={handleUserDeletion}
          title="Confirm Account Deletion"
          description="Are you sure you want to delete your account? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default UserDelete;
