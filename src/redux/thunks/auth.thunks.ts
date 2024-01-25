import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, handleError } from "@/services/axios.instance";
import { LoginCredentials, RegistrationData } from "../types/auth.types";
import { setupTokenRefresh } from "@/services/auth.service";
import { useRouter } from 'next/router';

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const access_token = response.data.access_token;
      setupTokenRefresh(access_token);
      return {
        access_token: access_token,
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegistrationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      const access_token = response.data.access_token;
      setupTokenRefresh(access_token);
      return {
        message: response.data.message,
        user: response.data.user,
        access_token: access_token,
      };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const checkRefreshToken = createAsyncThunk(
  "auth/check-refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/check-refresh");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(checkRefreshToken());
      if (result.payload.verified) {
        const response = await axiosInstance.post("/auth/refresh");
        const access_token = response.data.access_token;
        setupTokenRefresh(access_token);
        return { access_token: access_token, user: response.data.user};
      }
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(handleError(error));
    }
  }
);

export const verifySession = createAsyncThunk(
  "auth/verify-session",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/verify-session");
      return {
        verified: response.data.verified,
        username: response.data.username,
      };
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(handleError(error));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      if (typeof window !== 'undefined') {
        console.log('should redirect after this.')
        const router = useRouter();
        router.push('/auth/login');
      }
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);
