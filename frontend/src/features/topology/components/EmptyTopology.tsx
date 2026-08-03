// src/features/topology/components/EmptyTopology.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface EmptyTopologyProps {
  onClearFilters?: () => void;
  hasFiltersActive?: boolean;
}

export const EmptyTopology: React.FC<EmptyTopologyProps> = ({
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
      <AccountTreeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.primary" gutterBottom>
        No Electrical Topology Nodes Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {hasFiltersActive
          ? 'No grid feeders, distribution transformers, or poles matched your filter criteria.'
          : 'Electrical network topology has not been configured.'}
      </Typography>
      {hasFiltersActive && onClearFilters && (
        <Button variant="outlined" color="primary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};
