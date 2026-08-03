// src/pages/NotFound.tsx
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2">404</Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
        Page not found
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
