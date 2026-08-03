// src/features/analytics/components/AnalyticsSkeleton.tsx

import React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
    </Box>
  );
};
