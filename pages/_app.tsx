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
import "../styles/globals.css";

let inactivityTimer: NodeJS.Timeout | number;

const startInactivityTimer = (timeout = 15 * 60 * 1000) => {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    store.dispatch(logout()).then(() => {
      fetch("/api/logout-session", { method: "POST" })
        .then(() => {
          window.location.href = "/auth/login";
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, timeout);
};

const resetInactivityTimer = (timeout = 15 * 60 * 1000) => {
  startInactivityTimer(timeout);
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const cookies = parseCookies({});
    const auth_cookie = cookies["authenticated"];
    const { token, error, loading } = store.getState().auth;
    if (auth_cookie && !token && !error && !loading) {
      store.dispatch(refreshToken());
    }
  }, []);

  useEffect(() => {
    const cookies = parseCookies({});
    const auth_cookie = cookies["authenticated"];
    const verify = async () => {
      const { error, loading } = store.getState().auth;
      if (auth_cookie && !error && !loading) {
        store.dispatch(verifySession());
      }
    };
    const timeout = setTimeout(verify);
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
    const cookies = parseCookies({});
    const auth_cookie = cookies["authenticated"];
    if (auth_cookie) {
      startInactivityTimer();
    }
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
