import React, { useState, useRef } from "react";
import Link from "next/link";
import LogoutButton from "../auth/logout.button";
import Image from "next/image";
import DeleteButton from "./delete.button";
import { useSelector } from "react-redux";
import { deleteUser } from "@/services/user.service";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";
import { DeleteButtonHandle } from "./delete.button";
import Error from "./error";

const Header = () => {
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
    <div className="bg-white shadow-md w-full text-black font-bold h-[90px] fixed top-[0%] left-0 flex flex-row items-center px-6 py-3 z-50">
      <Link href="/" passHref>
        <div className="flex items-center">
          <h2 className="text-[20px] smd:text-[16px] smd:w-[6rem] md:w-[13rem]">
            Task Tracker
          </h2>
          <Image
            src="/dalle-logo.png"
            alt="Logo"
            width={1024}
            height={1024}
            className="round-logo"
          />
        </div>
      </Link>
      <div className="flex flex-row w-full justify-end">
        {errorMessage && (
          <div className="my-3">
            <Error errorMessage={errorMessage} />
          </div>
        )}
        <LogoutButton />
        <div className="flex flex-row items-center justify-center border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-2 py-2 rounded-[4px] md:hidden  smd:ml-4 cursor-pointer" onClick={() => deleteButtonRef.current!.openModal()}> 
          <i className="fa-solid fa-user-slash text-[18px] text-gray-400 mr-3 smd:mr-0 hover:text-white"></i>
          <DeleteButton
            ref={deleteButtonRef}
            onDelete={handleUserDeletion}
            title="Confirm Account Deletion"
            description="Are you sure you want to delete your account? This action cannot be undone."
            noText={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
