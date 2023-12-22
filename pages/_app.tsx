import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import { logout } from "@/redux/thunks/auth.thunks";

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

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
