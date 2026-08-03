// src/components/ui/LoadingScreen.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Initializing Smart Grid Control System...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <CircularProgress
          size={72}
          thickness={3}
          sx={{
            color: 'primary.main',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          }}
        >
          <FlashOnIcon sx={{ color: '#FFFFFF', fontSize: 26 }} />
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 0.5 }}>
        PROPEL
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};
