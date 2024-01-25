import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Loading from "@/app/nav/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isRefreshing, loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isRefreshing) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isRefreshing, router]);

  if (!isAuthenticated && !isRefreshing) return null;

  if (loading) {
    return <Loading loading={loading} />;
  }

  return children;
};

export default PrivateRoute;
