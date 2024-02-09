import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/nav/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { parseCookies } from "nookies";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isRefreshing, loading } = useSelector((state: RootState) => state.auth);
  const cookies = parseCookies({})
  const auth_cookie = cookies["authenticated"]; 

  useEffect(() => {
    if (!auth_cookie && !isRefreshing && !loading) {
      router.push("/auth/login");
    }
  }, [auth_cookie, isRefreshing, loading, router]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return children;
};

export default PrivateRoute;
