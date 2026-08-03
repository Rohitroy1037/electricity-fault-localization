// src/features/analytics/components/MTTRCard.tsx

import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Skeleton, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { MTTRData } from '../types/analytics.types';

interface MTTRCardProps {
  data?: MTTRData;
  isLoading?: boolean;
}

export const MTTRCard: React.FC<MTTRCardProps> = ({
  data,
  isLoading = false,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={<AccessTimeIcon color="secondary" />}
        title={<Typography variant="h6">Lifecycle Time & MTTR Metrics</Typography>}
        subheader="Mean Time Duration Benchmarks"
      />
      <Divider />
      <CardContent>
        {isLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={32} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {/* MTTD */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  MTTD (Detection)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {data?.mttdMinutes !== undefined ? `${data.mttdMinutes} m` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mean Time To Detect
                </Typography>
              </Box>
            </Grid>

            {/* MTTA */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  MTTA (Acknowledge)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {data?.mttaMinutes !== undefined ? `${data.mttaMinutes} m` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mean Time To Acknowledge
                </Typography>
              </Box>
            </Grid>

            {/* MTTR */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  MTTR (Resolution)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                  {data?.mttrMinutes !== undefined ? `${data.mttrMinutes} m` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mean Time To Resolve
                </Typography>
              </Box>
            </Grid>

            {/* MTTV */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  MTTV (Verification)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {data?.mttvMinutes !== undefined ? `${data.mttvMinutes} m` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mean Time To Verify
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
