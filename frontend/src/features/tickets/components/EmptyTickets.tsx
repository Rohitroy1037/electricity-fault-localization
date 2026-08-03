// src/features/tickets/components/EmptyTickets.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

interface EmptyTicketsProps {
  onClearFilters?: () => void;
  hasFiltersActive?: boolean;
}

export const EmptyTickets: React.FC<EmptyTicketsProps> = ({
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
      <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.primary" gutterBottom>
        No Tickets Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {hasFiltersActive
          ? 'No tickets match your filter criteria. Try adjusting or resetting your search parameters.'
          : 'There are currently no tickets logged in the system.'}
      </Typography>
      {hasFiltersActive && onClearFilters && (
        <Button variant="outlined" color="primary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};
