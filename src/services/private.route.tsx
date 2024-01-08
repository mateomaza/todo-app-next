import React from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Loading from "@/app/nav/loading";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, authenticated } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Loading loading={loading}/>;
  }

  if (!authenticated) {
    router.push("/auth/login");
    return null;
  }

  return children;
};

export default PrivateRoute;
