import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Loading from "@/app/nav/loading";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push("/auth/login");
    }
  }, [authenticated, router]);

  if (!authenticated) return null;

  if (loading) {
    return <Loading loading={loading} />;
  }

  return children;
};

export default PrivateRoute;
