// src/pages/Login.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginCard } from '../features/auth/components/LoginCard';
import { LoginForm } from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { Box, Link } from '@mui/material';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they tried to visit, or dashboard
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <Box sx={{ width: '100%' }}>
      <LoginCard>
        <LoginForm />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href={ROUTES.FORGOT_PASSWORD} variant="body2" underline="hover">
            Forgot password?
          </Link>
        </Box>
      </LoginCard>
    </Box>
  );
};

export default Login;
