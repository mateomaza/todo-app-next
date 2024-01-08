import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import { logout, refresh, verifyToken } from "@/redux/thunks/auth.thunks";
import { useRouter } from "next/router";

let inactivityTimer: NodeJS.Timeout | number;

const startInactivityTimer = (timeout = 15 * 60 * 1000) => {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => store.dispatch(logout()), timeout);
};

const resetInactivityTimer = (timeout = 15 * 60 * 1000) => {
  startInactivityTimer(timeout);
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const { token, hasAttemptedRefresh } = store.getState().auth;
    if (!token && !hasAttemptedRefresh) {
      store.dispatch(refresh());
    }
  }, []);

  useEffect(() => {
    const verifySession = () => {
      const access_token = store.getState().auth.token;
      if (access_token) {
        store.dispatch(verifyToken()).catch(() => {
          router.push("/auth/login");
        });
      }
    };
    verifySession();
    const interval = setInterval(verifySession, 13 * 60 * 1000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);
    startInactivityTimer();
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
      clearTimeout(inactivityTimer);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Cypress) {
      window.store = store;
    }
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
