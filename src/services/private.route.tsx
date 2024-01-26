import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/nav/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isRefreshing, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('/api/check-session');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setLoading(false);
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !loading && isRefreshing && !error) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router, isRefreshing, error]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return isAuthenticated ? children : null;
};

export default PrivateRoute;
