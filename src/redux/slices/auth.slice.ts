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
  user: null,
  token: null,
  loading: false,
  error: null,
  isRefreshing: false,
  isLoggingOut: false,
  UserObjectId: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          state.loading = false;
          state.error = null;
          state.UserObjectId = action.payload.user._id;
        }
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
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
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          state.loading = false;
          state.error = null;
          state.UserObjectId = action.payload.user._id;
        }
      )
      .addCase(
        register.rejected,
        (state, action: PayloadAction<AuthError | unknown>) => {
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
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.loading = false;
            state.error = null;
            state.isRefreshing = false;
            state.UserObjectId = action.payload.user._id;
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
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.isLoggingOut = false;
        state.isRefreshing = false;
        state.UserObjectId = undefined;
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

export const { resetError: resetErrorAction } = authSlice.actions;

export default authSlice.reducer;
