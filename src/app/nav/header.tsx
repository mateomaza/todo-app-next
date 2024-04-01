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
    <div className="bg-white shadow-md w-full text-black font-bold h-[90px] fixed top-0 left-0 flex items-center px-6 py-3 z-50">
      <div className="flex items-center justify-start w-1/3">
        <Link href="/" passHref>
          <a className="flex items-center">
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
          </a>
        </Link>
      </div>
      <div className="flex-grow text-center">
        <p className="text-sm font-light">
          App created by{" "}
          <a
            href="https://linktr.ee/mateomaza"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <u>Mateo Maza</u>
          </a>
        </p>
      </div>
      <div className="flex items-center justify-end w-1/3">
        {errorMessage && (
          <div className="my-3 mr-4">
            <Error errorMessage={errorMessage} />
          </div>
        )}
        <LogoutButton />
        <div className="flex flex-row items-center justify-center border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-2 py-2 rounded-[4px] md:hidden smd:ml-4 cursor-pointer">
          <i
            className="fa-solid fa-user-slash text-[18px] text-gray-400 mr-3 smd:mr-0 hover:text-white"
            onClick={() => deleteButtonRef.current!.openModal()}
          ></i>
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
