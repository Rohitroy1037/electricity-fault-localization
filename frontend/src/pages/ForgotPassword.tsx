// src/pages/ForgotPassword.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Password recovery is not yet implemented. Please contact your system administrator.
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.LOGIN)}>
        Return to Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;
