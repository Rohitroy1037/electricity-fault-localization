// src/features/auth/components/LoginCard.tsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface LoginCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  children,
  title = 'Sign In',
  subtitle = 'Enter your operator credentials to access the control center',
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        p: 2,
        borderRadius: 4,
        backdropFilter: 'blur(16px)',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(17, 24, 39, 0.75)'
            : 'rgba(255, 255, 255, 0.85)',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(15, 23, 42, 0.08)',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.6)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};
