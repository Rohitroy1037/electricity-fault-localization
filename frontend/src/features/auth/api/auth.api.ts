// src/features/auth/api/auth.api.ts
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import { LoginDto } from '../types/login.dto';
import { LoginResponse, User } from '../types/auth.types';

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT);
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

export const refreshToken = async (): Promise<string> => {
  const response = await api.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH);
  return response.data.token;
};
