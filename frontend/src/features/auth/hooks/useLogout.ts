// src/features/auth/hooks/useLogout.ts
import { useAuth } from './useAuth';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
  const { logout } = useAuth();
  return useMutation({ mutationFn: async () => logout() });
};
