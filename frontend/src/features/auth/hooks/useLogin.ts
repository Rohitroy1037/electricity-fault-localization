// src/features/auth/hooks/useLogin.ts
import { useAuth } from './useAuth';
import { LoginDto } from '../types/login.dto';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const { login } = useAuth();
  return useMutation({ mutationFn: (data: LoginDto) => login(data) });
};
