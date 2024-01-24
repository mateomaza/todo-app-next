import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import {
  logout,
  refreshToken,
  verifySession,
} from "@/redux/thunks/auth.thunks";
import { parseCookies } from "nookies";

let inactivityTimer: NodeJS.Timeout | number;

const startInactivityTimer = (timeout = 15 * 60 * 1000) => {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => store.dispatch(logout()), timeout);
};

const resetInactivityTimer = (timeout = 15 * 60 * 1000) => {
  startInactivityTimer(timeout);
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {

  useEffect(() => {
    const refresh = () => {
      const access_token = store.getState().auth.token;
      const cookies = parseCookies();
      const hasRefreshToken = Boolean(cookies["refresh_token"]);
      if (!access_token && hasRefreshToken) {
        store.dispatch(refreshToken());
      }
    };
    const delay = 69;
    const timeout = setTimeout(refresh, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const verify = () => {
      const access_token = store.getState().auth.token;
      if (access_token) {
        store.dispatch(verifySession());
      }
    };
    const delay = 69;
    const timeout = setTimeout(verify, delay);
    const interval = setInterval(verify, 13 * 60 * 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

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
