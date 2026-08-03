// src/features/auth/services/auth.service.ts
import { login as apiLogin, logout as apiLogout, fetchCurrentUser as apiFetchUser, refreshToken as apiRefresh } from '../api/auth.api';
import { LoginDto } from '../types/login.dto';
import { LoginResponse, User } from '../types/auth.types';

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  return apiLogin(data);
};

export const logout = async (): Promise<void> => {
  await apiLogout();
};

export const fetchCurrentUser = async (): Promise<User> => {
  return apiFetchUser();
};

export const refreshToken = async (): Promise<string> => {
  return apiRefresh();
};
