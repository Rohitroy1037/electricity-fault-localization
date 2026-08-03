// src/features/analytics/components/TrendChart.tsx

import React from 'react';
import { Card, CardHeader, CardContent, Box, Typography, Skeleton, LinearProgress, Chip } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { TrendItem } from '../types/analytics.types';

interface TrendChartProps {
  trends?: TrendItem[];
  isLoading?: boolean;
  groupBy?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  trends = [],
  isLoading = false,
  groupBy = 'day',
}) => {
  // Find max value to normalize bar heights/widths
  const maxVal = Math.max(
    ...trends.flatMap((t) => [t.incidents || 0, t.tickets || 0, t.outages || 0]),
    1
  );

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={<ShowChartIcon color="primary" />}
        title={<Typography variant="h6">Performance Trends</Typography>}
        subheader={`Grouped by ${groupBy}`}
        action={
          <Box display="flex" gap={1} pt={1}>
            <Chip size="small" label="Incidents" color="error" variant="outlined" />
            <Chip size="small" label="Tickets" color="warning" variant="outlined" />
            <Chip size="small" label="Outages" color="secondary" variant="outlined" />
          </Box>
        }
      />
      <CardContent>
        {isLoading ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={32} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        ) : trends.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
            No trend data recorded for this time range.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {trends.map((item, idx) => (
              <Box key={idx} p={1.5} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.label || item.timestamp}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.incidents} Incidents • {item.tickets} Tickets • {item.outages} Outages
                  </Typography>
                </Box>
                
                {/* Visual Bar Breakdown */}
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ width: 60 }}>Incidents</Typography>
                    <Box flex={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.incidents / maxVal) * 100}
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ width: 60 }}>Tickets</Typography>
                    <Box flex={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.tickets / maxVal) * 100}
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ width: 60 }}>Outages</Typography>
                    <Box flex={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.outages / maxVal) * 100}
                        color="secondary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
