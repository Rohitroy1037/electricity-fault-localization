// src/features/auth/types/auth.types.ts
export interface JwtPayload {
  sub: string;
  exp: number; // Unix timestamp (seconds)
  iat?: number;
  roles?: string[];
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
