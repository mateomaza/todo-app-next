import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const { token, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, [token]);

  return { loading, authenticated };
};

export default useAuth;
