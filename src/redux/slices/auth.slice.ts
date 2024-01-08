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
  hasAttemptedRefresh: false,
  isLoggingOut: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: () => initialState,
  },
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
        state.hasAttemptedRefresh = false;
      })
      .addCase(login.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
        state.hasAttemptedRefresh = false;
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
        state.hasAttemptedRefresh = false
      })
      .addCase(register.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
        state.hasAttemptedRefresh = false;
      })

      builder
      .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.hasAttemptedRefresh = true;
      })
      .addCase(refresh.fulfilled, (state, action: PayloadAction<RefreshResponse>) => {
        state.token = action.payload.access_token;
        state.loading = false;
        state.error = null;
        state.hasAttemptedRefresh = false;
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
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, () => {
        return authSlice.caseReducers.resetAuthState();
      })
      .addCase(logout.rejected, (state, action: PayloadAction<AuthError | unknown>) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
        state.isLoggingOut = false;
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
