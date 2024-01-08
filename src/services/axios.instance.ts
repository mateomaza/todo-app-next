import { store } from "@/redux/store";
import { refresh } from "@/redux/thunks/auth.thunks";
import axios, { AxiosError } from "axios";
import Router from "next/router";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = store.getState().auth.token;
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { hasAttemptedRefresh } = store.getState().auth;
      if (!hasAttemptedRefresh) {
        try {
          const newToken = await store.dispatch(refresh()).unwrap();
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          Router.push("/auth/login");
          return Promise.reject(refreshError);
        }
      }
      Router.push("/auth/login");
    }
    return Promise.reject(error);
  }
);

export function handleError(error: unknown): string {
  if (error instanceof AxiosError && error.response) {
    return error.response.data;
  }
  return "An unexpected error occurred";
}
