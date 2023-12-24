import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import { logout, refresh } from "@/redux/thunks/auth.thunks";
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
  const access_token = store.getState().auth.token;

  useEffect(() => {
    if (!access_token) {
      store
        .dispatch(refresh())
        .then((result) => {
          if (!result.payload) {
            router.push("/auth/login-page");
          }
        })
        .catch(() => {
          router.push("/auth/login-page");
        });
    }
    const handleActivity = () => resetInactivityTimer();
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);
    startInactivityTimer();
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
      clearTimeout(inactivityTimer);
    };
  }, [access_token, router]);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
