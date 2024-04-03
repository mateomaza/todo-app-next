import React, { useState, useRef } from "react";
import DeleteButton from "@/app/nav/delete.button";
import { deleteUser } from "@/services/user.service";
import Error from "@/app/nav/error";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { DeleteButtonHandle } from "@/app/nav/delete.button";

const UserDelete = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const { UserObjectId } = useSelector((state: RootState) => state.auth);
  const deleteButtonRef = useRef<DeleteButtonHandle | null>(null);

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

  return (
    <div className="sidebar flex flex-col justify-end mr-5 py-4 px-9 bg-slate-300 border-r-2 border-gray-500 fixed min-h-screen">
      <div className="flex flex-row items-center justify-center border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-2 py-2 rounded-[4px] cursor-pointer">
        {errorMessage && (
          <div className="my-3">
            <Error errorMessage={errorMessage} />
          </div>
        )}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            className="icon w-6 h-6 text-gray-400 mr-2 hover:text-white"
            onClick={() => deleteButtonRef.current!.openModal()}
            role="img"
            aria-label="Delete user account"
          >
            <path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z" />
        </svg>
        <DeleteButton
          ref={deleteButtonRef}
          onDelete={handleUserDeletion}
          title="Confirm Account Deletion"
          description="Are you sure you want to delete your account? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default UserDelete;
