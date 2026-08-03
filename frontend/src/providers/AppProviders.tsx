// src/providers/AppProviders.tsx
// Root provider that composes ThemeProvider, QueryProvider, and BrowserRouter.
// This file isolates all global providers from the rest of the app.

import React from 'react';
import { ThemeProviderWrapper } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <BrowserRouter>
      <ThemeProviderWrapper>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProviderWrapper>
    </BrowserRouter>
  </AuthProvider>
);
