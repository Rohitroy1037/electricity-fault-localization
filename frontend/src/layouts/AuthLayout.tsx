// src/layouts/AuthLayout.tsx
// High-End Animated Mesh Background Layout for Authentication Pages.

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const AuthLayout: React.FC = () => (
  <Box
    sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'radial-gradient(ellipse at 50% 20%, #1E293B 0%, #090D16 70%)'
          : 'radial-gradient(ellipse at 50% 20%, #E2E8F0 0%, #F8FAFC 70%)',
      position: 'relative',
      overflow: 'hidden',
      py: 4,
    }}
  >
    {/* Subtle Background Glowing Grid Orbs */}
    <Box
      sx={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }}
    />

    <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
      {/* Brand Header */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            mb: 1.5,
          }}
        >
          <FlashOnIcon sx={{ color: '#FFFFFF', fontSize: 32 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          PROPEL PLATFORM
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', fontWeight: 600 }}>
          SMART GRID FAULT LOCALIZATION
        </Typography>
      </Box>

      {/* Auth Form Card */}
      <Outlet />
    </Container>
  </Box>
);

export default AuthLayout;
