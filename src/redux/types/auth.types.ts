export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  isLoggingOut: boolean;
  UserObjectId: string | undefined;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User & { _id: string };
}

export interface CheckRefreshResponse {
  verified: boolean;
}

export interface RefreshResponse {
  access_token: string;
  user: User & { _id: string };
}

export interface VerifyResponse {
  verified: boolean;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}
