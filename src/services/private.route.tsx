import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/nav/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isRefreshing, loading } = useSelector((state: RootState) => state.auth);
  const auth_cookie = Cookies.get('authenticated'); 

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
