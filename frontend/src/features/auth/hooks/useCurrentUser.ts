// src/features/auth/hooks/useCurrentUser.ts
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { User } from '../types/auth.types';

export const useCurrentUser = () => {
  const { user, token, loading, restoreSession } = useAuth();
  // If we already have user in context, return it via query placeholder
  const query = useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // In case user is not loaded yet, attempt manual restore
      if (!user && token) {
        throw new Error('User not available');
      }
      return user as User; // will be null if not authenticated
    },
    enabled: !!token && !loading,
    staleTime: Infinity,
  });
  return query;
};
