import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

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
      const response = await axiosInstance.post('/auth/refresh');
      const newAccessToken = response.data.access_token;
      localStorage.setItem('token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

export default axiosInstance;