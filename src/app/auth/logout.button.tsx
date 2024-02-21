import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BounceLoader } from "react-spinners";
import { logout } from "@/redux/thunks/auth.thunks";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/router";

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isLoggingOut } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = async () => {
    await dispatch(logout());
    fetch("/api/logout-session", { method: "POST" })
      .then(() => {
        router.push("/auth/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {isLoggingOut ? (
        <>
          <BounceLoader color="#007BFF" loading={loading} size={60} />
        </>
      ) : (
        <button
          onClick={handleLogout}
          disabled={loading}
          type={"button"}
          className="w-[120px] h-[36px] bg-blue-700 rounded-[6px] text-white font-bold flex flex-row text-center justify-center items-center  hover:bg-slate-200 hover:border-2 hover:border-blue-700 hover:text-blue-700"
        >
          Logout
        </button>
      )}
    </div>
  );
}
