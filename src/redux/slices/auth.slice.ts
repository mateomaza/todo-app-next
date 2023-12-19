import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register, logout, refresh, verifyToken } from "../thunks/auth.thunks";
import { AuthState, AuthResponse, RefreshResponse, VerifyResponse, AuthError } from "../types/auth.types";
import { getErrorMessage } from "./utilities";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })

      builder
      .addCase(refresh.pending, (state) => {
        state.loading = true;
      })
      .addCase(refresh.fulfilled, (state, action: PayloadAction<RefreshResponse>) => {
        state.token = action.payload.access_token;
        state.loading = false;
        state.error = null;
      })
      .addCase(refresh.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      });

      builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<VerifyResponse>) => {
        state.isAuthenticated = action.payload.verified;
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      });
  },
});

export default authSlice.reducer;
