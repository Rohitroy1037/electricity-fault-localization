// src/features/incidents/components/EmptyIncidents.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyIncidentsProps {
  onClearFilters?: () => void;
  hasFiltersActive?: boolean;
}

export const EmptyIncidents: React.FC<EmptyIncidentsProps> = ({
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
      <InboxIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.primary" gutterBottom>
        No Incidents Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {hasFiltersActive
          ? 'No incidents match your current filter criteria. Try adjusting or clearing your filters.'
          : 'There are no incidents recorded in the system yet.'}
      </Typography>
      {hasFiltersActive && onClearFilters && (
        <Button variant="outlined" color="primary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};
