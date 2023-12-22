import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { AppDispatch, store } from "@/redux/store";
import { AppProps } from "next/app";
import { useDispatch } from 'react-redux';
import { logout } from "@/redux/thunks/auth.thunks";

let inactivityTimer: NodeJS.Timeout | number;

const startInactivityTimer = (dispatch: AppDispatch, timeout = 15 * 60 * 1000) => {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => dispatch(logout()), timeout);
};

const resetInactivityTimer = (dispatch: AppDispatch, timeout = 15 * 60 * 1000) => {
  startInactivityTimer(dispatch, timeout);
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer(dispatch);
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);
    startInactivityTimer(dispatch);
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
      clearTimeout(inactivityTimer);
    };
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
