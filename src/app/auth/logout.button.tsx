import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BounceLoader } from "react-spinners";
import { logout } from "@/redux/thunks/auth.thunks";
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from "next/router";

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      router.push("/auth/login-page");
    });
  };

  return (
    <div>
      {loading ? (
        <BounceLoader color="#007BFF" loading={loading} size={60} />
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
      <h1>{loading ? 'Logging Out...' : 'Click to Logout'}</h1>
    </div>
  );
}
