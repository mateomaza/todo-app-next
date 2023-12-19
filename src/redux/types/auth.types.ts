interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
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
  user: User;
}

export interface RefreshResponse {
  access_token: string;
}

export interface VerifyResponse {
  username: string;
  verified: boolean;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}
