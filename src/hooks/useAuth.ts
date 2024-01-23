import { useState, useEffect } from "react";
import { parseCookies } from 'nookies';

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = parseCookies();
      const refreshToken = cookies['refresh_token'];
      if (refreshToken) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { loading, authenticated };
};

export default useAuth;
