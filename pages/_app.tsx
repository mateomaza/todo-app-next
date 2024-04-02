import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import {
  logout,
  refreshToken,
} from "@/redux/thunks/auth.thunks";
import Cookies from 'js-cookie';
import Head from 'next/head';
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
    const auth_cookie = Cookies.get('authenticated');
    const { token, error, loading } = store.getState().auth;
    if (auth_cookie && !token && !loading) {
      store.dispatch(refreshToken());
    }
  }, []);

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);
    const auth_cookie = Cookies.get('authenticated');
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
        <meta property="og:image" content="https://www.holi.website/featured-image.png" />
        <meta property="og:url" content="https://www.holi.website" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@mateomaza__" />
        <meta name="twitter:title" content="TaskTracker" />
        <meta name="twitter:description" content="Friendly app that allows you to have a record of your daily tasks" />
        <meta name="twitter:image" content="https://www.holi.website/featured-image.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
