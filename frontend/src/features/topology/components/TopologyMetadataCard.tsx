// src/features/topology/components/TopologyMetadataCard.tsx

import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import PowerIcon from '@mui/icons-material/Power';
import TransformIcon from '@mui/icons-material/Transform';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SensorsIcon from '@mui/icons-material/Sensors';
import { TopologyMetadata } from '../types/topology.types';

interface TopologyMetadataCardProps {
  metadata?: TopologyMetadata;
  isLoading?: boolean;
}

export const TopologyMetadataCard: React.FC<TopologyMetadataCardProps> = ({
  metadata,
  isLoading = false,
}) => {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'primary.light', color: 'primary.dark', p: 1.5, borderRadius: 2, display: 'flex' }}>
              <PowerIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Feeders
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {metadata?.totalFeeders ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'info.light', color: 'info.dark', p: 1.5, borderRadius: 2, display: 'flex' }}>
              <TransformIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Transformers
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {metadata?.totalTransformers ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'warning.light', color: 'warning.dark', p: 1.5, borderRadius: 2, display: 'flex' }}>
              <LocationOnIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Distribution Poles
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {metadata?.totalPoles ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'success.light', color: 'success.dark', p: 1.5, borderRadius: 2, display: 'flex' }}>
              <SensorsIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                IoT Instrumented Nodes
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {metadata?.instrumentedPoles ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
