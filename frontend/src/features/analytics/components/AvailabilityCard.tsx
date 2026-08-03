// src/features/analytics/components/AvailabilityCard.tsx

import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Skeleton, Divider } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import { AvailabilityData } from '../types/analytics.types';

interface AvailabilityCardProps {
  data?: AvailabilityData;
  isLoading?: boolean;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  data,
  isLoading = false,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={<SpeedIcon color="primary" />}
        title={<Typography variant="h6">Grid Reliability Indices</Typography>}
        subheader="IEEE 1366 Standard Metrics"
      />
      <Divider />
      <CardContent>
        {isLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} key={i}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={32} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {/* SAIDI */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  SAIDI (Duration)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {data?.saidi !== undefined ? `${data.saidi} hrs` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  System Avg Interruption Duration
                </Typography>
              </Box>
            </Grid>

            {/* SAIFI */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  SAIFI (Frequency)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                  {data?.saifi !== undefined ? `${data.saifi} /cust` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  System Avg Interruption Freq
                </Typography>
              </Box>
            </Grid>

            {/* ASAI */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  ASAI (Availability)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {data?.asai !== undefined ? `${data.asai}%` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Average System Availability
                </Typography>
              </Box>
            </Grid>

            {/* CAIDI */}
            <Grid item xs={6} sm={3}>
              <Box p={1.5} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  CAIDI (Customer Avg)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {data?.caidi !== undefined ? `${data.caidi} mins` : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Customer Avg Interruption Duration
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
