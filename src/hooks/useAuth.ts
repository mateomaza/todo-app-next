import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store';

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const authenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (authenticated !== null) {
      setLoading(false);
    }
  }, [authenticated]);

  return { loading, authenticated };
};

export default useAuth;
