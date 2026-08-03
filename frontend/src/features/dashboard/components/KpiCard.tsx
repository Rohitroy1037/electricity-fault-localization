import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

interface KpiCardProps {
  title: string;
  value?: number | string;
  icon?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color = 'primary.main', isLoading = false }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color="textSecondary" variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {title}
          </Typography>
          {icon && <Box sx={{ color }}>{icon}</Box>}
        </Box>
        {isLoading ? (
          <Skeleton variant="text" width="60%" height={60} />
        ) : (
          <Typography variant="h4" color="textPrimary">
            {value !== undefined ? value : '-'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
