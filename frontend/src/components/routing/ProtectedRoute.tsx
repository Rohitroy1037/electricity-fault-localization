// src/components/routing/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { LoadingScreen } from '../ui/LoadingScreen';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return <Outlet />;
};
