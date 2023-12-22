import { store } from "@/redux/store";
import { refresh } from "@/redux/thunks/auth.thunks";
import axios, { AxiosError } from "axios";
import Router from 'next/router';

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      try {
        const newToken = await store.dispatch(refresh()).unwrap();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Router.push('/auth/login-page');
        return Promise.reject(refreshError);
      }
    }
    Router.push('/auth/login-page');
    return Promise.reject(error);
  }
);

export function handleError(error: unknown): string {
  if (error instanceof AxiosError && error.response) {
    return error.response.data;
  }
  return 'An unexpected error occurred';
}
