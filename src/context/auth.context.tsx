import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { logoutUser } from '@/services/auth.service';

interface AuthState {
  token: string | null;
  user: any;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ token: null, user: null });

  useEffect(() => {
    const handleLogout = () => {
      logoutUser();
      setAuthState({ token: null, user: null });
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};