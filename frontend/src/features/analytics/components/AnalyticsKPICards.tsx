// src/features/analytics/components/AnalyticsKPICards.tsx

import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { AnalyticsSummary } from '../types/analytics.types';

interface AnalyticsKPICardsProps {
  summary?: AnalyticsSummary;
  isLoading?: boolean;
}

export const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({
  summary,
  isLoading = false,
}) => {
  return (
    <Grid container spacing={3} mb={3}>
      {/* Total Incidents */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'error.light',
                color: 'error.dark',
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
              }}
            >
              <ReportProblemIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Incidents
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {summary?.totalIncidents ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Tickets */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'warning.light',
                color: 'warning.dark',
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
              }}
            >
              <ConfirmationNumberIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Tickets
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {summary?.totalTickets ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Outages */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'secondary.light',
                color: 'secondary.dark',
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
              }}
            >
              <PowerOffIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Outages
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {summary?.totalOutages ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Asset Health Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'success.light',
                color: 'success.dark',
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
              }}
            >
              <HealthAndSafetyIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Asset Health Score
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {summary?.assetHealthScore !== undefined ? `${summary.assetHealthScore}%` : 'N/A'}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
