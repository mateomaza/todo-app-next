import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      const newToken = await refreshToken();
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh");
    const newAccessToken = response.data.access_token;
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};

export function handleError(error: unknown): string {
  if (error instanceof AxiosError && error.response) {
    return error.response.data;
  }
  return 'An unexpected error occurred';
}
