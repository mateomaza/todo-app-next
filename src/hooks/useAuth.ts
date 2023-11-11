import { useState, useEffect } from "react";
import { isAuthenticated } from "@/services/auth-service";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setAuthenticated(authStatus);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { loading, authenticated };
};

export default useAuth;
