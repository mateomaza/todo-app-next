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
import Head from 'next/head';
import "../styles/globals.css";
import { useRouter } from "next/router";

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
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="16x16" type="image/x-icon" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <title>TaskTracker</title>
        <meta name="description" content="Friendly app that allows you to have a record of your daily tasks." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1E40AF" />
        <meta property="og:title" content="TaskTracker" />
        <meta property="og:description" content="Friendly app that allows you to have a record of your daily tasks" />
        <meta property="og:image" content="https://www.holi.website/dalle-logo.png" />
        <meta property="og:url" content="https://www.holi.website" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@mateomaza__" />
        <meta name="twitter:title" content="TaskTracker" />
        <meta name="twitter:description" content="Friendly app that allows you to have a record of your daily tasks" />
        <meta name="twitter:image" content="https://www.holi.website/dalle-logo.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
