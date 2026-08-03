import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress,
  Skeleton
} from '@mui/material';
import { SystemHealthData } from '../types/dashboard.types';

interface SystemHealthProps {
  data?: SystemHealthData;
  isLoading?: boolean;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ data, isLoading = false }) => {
  const getColor = (status?: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'critical': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Health
        </Typography>
        
        {isLoading ? (
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 1 }} />
          </Box>
        ) : !data ? (
          <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
            Health data unavailable.
          </Typography>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                Status: {data.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.score}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={data.score} 
              color={getColor(data.status)}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
