import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, handleError } from "@/services/axios.instance";
import { LoginCredentials, RegistrationData } from "../types/auth.types";
import { setupTokenRefresh } from "@/services/auth.service";
import { useRouter } from "next/router";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const access_token = response.data.access_token;
      setupTokenRefresh(access_token);
      await fetch("/api/create-session", {
        method: "POST",
        body: JSON.stringify({ username: response.data.user.username }),
        headers: { "Content-Type": "application/json" },
      });
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
      await fetch("/api/create-session", {
        method: "POST",
        body: JSON.stringify({ username: response.data.user.username }),
        headers: { "Content-Type": "application/json" },
      });
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
      const check = await dispatch(checkRefreshToken());
      if (check.payload.verified) {
        const response = await axiosInstance.post("/auth/refresh");
        const access_token = response.data.access_token;
        setupTokenRefresh(access_token);
        return { access_token: access_token, user: response.data.user };
      }
    } catch (error) {
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
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);
