// src/features/ai/components/AISkeleton.tsx

import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

export const AISkeleton: React.FC = () => {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" gap={2} mb={3}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box flex={1}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="90%" height={18} />
          <Skeleton variant="text" width="75%" height={18} />
        </Box>
      </Box>

      <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
    </Paper>
  );
};
