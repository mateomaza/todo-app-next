import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BounceLoader } from "react-spinners";
import { logout } from "@/redux/thunks/auth.thunks";
import { AppDispatch, RootState } from "@/redux/store";

export default function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isLoggingOut } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isLoggingOut ? (
        <>
          <BounceLoader color="#007BFF" loading={loading} size={60} />
          <h1>Logging Out...</h1>
        </>
      ) : (
        <button onClick={handleLogout} disabled={loading} data-testid="logout-button">
          Logout
        </button>
      )}
    </div>
  );
}
