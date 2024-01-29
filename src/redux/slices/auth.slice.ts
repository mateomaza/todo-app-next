import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  checkRefreshToken,
  refreshToken,
  verifySession,
} from "../thunks/auth.thunks";
import {
  AuthState,
  AuthResponse,
  CheckRefreshResponse,
  RefreshResponse,
  VerifyResponse,
  AuthError,
} from "../types/auth.types";
import { getErrorMessage } from "./utilities";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isRefreshing: false,
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
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isAuthenticated = true
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
          state.isAuthenticated = false
          state.loading = false;
          state.error = getErrorMessage(action.payload);
        }
      )
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isAuthenticated = true
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        register.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
          state.isAuthenticated = false
          state.loading = false;
          state.error = getErrorMessage(action.payload);
        }
      );

    builder
      .addCase(checkRefreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkRefreshToken.fulfilled,
        (state, action: PayloadAction<CheckRefreshResponse>) => {
          state.isAuthenticated = action.payload.verified
          state.loading = false;
        }
      )
      .addCase(
        checkRefreshToken.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
          state.loading = false;
          state.error = getErrorMessage(action.payload);
        }
      );

    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.isRefreshing = true;
      })
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<RefreshResponse | undefined>) => {
          if (action.payload) {
            state.isAuthenticated = true
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.loading = false;
            state.error = null;
            state.isRefreshing = false;
          } else {
            state.loading = false;
            state.error = "Refresh token response is undefined";
          }
        }
      )
      .addCase(
        refreshToken.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
          state.loading = false;
          state.error = getErrorMessage(action.payload);
        }
      );

    builder
      .addCase(verifySession.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        verifySession.fulfilled,
        (state, action: PayloadAction<VerifyResponse>) => {
          state.isAuthenticated = action.payload.verified;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        verifySession.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
          state.loading = false;
          state.error = getErrorMessage(action.payload);
        }
      );

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.isLoggingOut = false;
        state.isRefreshing = false;
      })
      .addCase(
        logout.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
          state.loading = false;
          state.error = getErrorMessage(action.payload);
          state.isLoggingOut = false;
        }
      );
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
