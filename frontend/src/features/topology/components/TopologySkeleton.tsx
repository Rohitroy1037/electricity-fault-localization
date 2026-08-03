// src/features/topology/components/TopologySkeleton.tsx

import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

export const TopologySkeleton: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    </Box>
  );
};
