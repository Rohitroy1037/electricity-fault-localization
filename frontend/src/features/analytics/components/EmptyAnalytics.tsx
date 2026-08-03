// src/features/analytics/components/EmptyAnalytics.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface EmptyAnalyticsProps {
  onClearFilters?: () => void;
  hasFiltersActive?: boolean;
}

export const EmptyAnalytics: React.FC<EmptyAnalyticsProps> = ({
  onClearFilters,
  hasFiltersActive = false,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={2}
      textAlign="center"
    >
      <AssessmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.primary" gutterBottom>
        No Analytics Data Available
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {hasFiltersActive
          ? 'No data points were found matching your active filter criteria. Try adjusting the date range or feeder selection.'
          : 'System analytics data has not been generated yet.'}
      </Typography>
      {hasFiltersActive && onClearFilters && (
        <Button variant="outlined" color="primary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};
