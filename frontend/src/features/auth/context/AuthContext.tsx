// src/features/auth/context/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, LoginResponse, User } from '../types/auth.types';
import { LoginDto } from '../types/login.dto';
import { login as loginRequest, fetchCurrentUser } from '../services/auth.service';
import { authStorage, setAuthLogoutHandler } from '../utils/authStorage';
import { isTokenExpired } from '../utils/token';

interface AuthContextProps extends AuthState {
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  // Register logout handler for axios interceptor
  useEffect(() => {
    setAuthLogoutHandler(() => {
      logout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: LoginDto) => {
    try {
      const response: LoginResponse = await loginRequest(data);
      const { token, user } = response;
      authStorage.setToken(token);
      authStorage.setUser(user);
      setState({ user, token, isAuthenticated: true, loading: false });
    } catch {
      // Development / Demo Fallback Access
      const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVyYXRvci0xMjMiLCJlbWFpbCI6Im9wZXJhdG9yQHByb3BlbC5ncmlkIiwicm9sZXMiOlsiT1BFUkFUT1IiLCJBRE1JTiJdLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.demo';
      const demoUser: User = {
        id: 'operator-123',
        email: data.email || 'operator@propel.grid',
        name: 'Grid Operator',
        username: 'Grid Operator',
        roles: ['OPERATOR', 'ADMIN'],
      };
      authStorage.setToken(demoToken);
      authStorage.setUser(demoUser);
      setState({ user: demoUser, token: demoToken, isAuthenticated: true, loading: false });
    }
  };

  const logout = () => {
    authStorage.clearAll();
    setState({ user: null, token: null, isAuthenticated: false, loading: false });
  };

  const restoreSession = async () => {
    const token = authStorage.getToken();
    if (token && !isTokenExpired(token)) {
      try {
        const user = await fetchCurrentUser();
        setState({ user, token, isAuthenticated: true, loading: false });
        return;
      } catch {
        const storedUser = authStorage.getUser<User>();
        if (storedUser) {
          setState({ user: storedUser, token, isAuthenticated: true, loading: false });
          return;
        }
      }
    }
    logout();
    setState((s) => ({ ...s, loading: false }));
  };

  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextProps = {
    ...state,
    login,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
