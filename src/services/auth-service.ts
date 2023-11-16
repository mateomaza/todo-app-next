import axiosInstance from "./axios-instance";


export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post('auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post('auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const response = await axiosInstance.get('auth/verifyToken', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.verified && response.status === 200;
  } catch (error) {
    console.error("Token Verification Error:", error);
    return false;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
