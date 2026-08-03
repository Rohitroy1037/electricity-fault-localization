// src/pages/Unauthorized.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const Unauthorized: React.FC = () => {
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
      <Typography variant="h3" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;
