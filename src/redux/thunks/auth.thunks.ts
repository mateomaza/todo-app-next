import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, handleError } from "@/services/axios.instance";
import { LoginCredentials, RegistrationData } from "../types/auth.types";
import { setupTokenRefresh } from "@/services/auth.service";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", credentials);
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
      const response = await axiosInstance.post("/api/auth/register", userData);
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

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/refresh");
      const access_token = response.data.access_token;
      setupTokenRefresh(access_token);
      return { access_token: access_token };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/auth/verifyToken");
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
      await axiosInstance.post("/api/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);
