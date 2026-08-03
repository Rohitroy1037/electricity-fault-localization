// src/features/topology/components/HierarchyBreadcrumb.tsx

import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PowerIcon from '@mui/icons-material/Power';
import TransformIcon from '@mui/icons-material/Transform';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface HierarchyBreadcrumbProps {
  selectedFeederId?: string;
  selectedTransformerId?: string;
  selectedPoleId?: string;
  onReset: () => void;
  onSelectFeeder?: () => void;
  onSelectTransformer?: () => void;
}

export const HierarchyBreadcrumb: React.FC<HierarchyBreadcrumbProps> = ({
  selectedFeederId,
  selectedTransformerId,
  selectedPoleId,
  onReset,
  onSelectFeeder,
  onSelectTransformer,
}) => {
  return (
    <Box mb={2}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="topology-breadcrumb">
        <Link
          component="button"
          variant="body2"
          onClick={onReset}
          color={!selectedFeederId ? 'text.primary' : 'inherit'}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: !selectedFeederId ? 600 : 400 }}
        >
          All Feeders
        </Link>

        {selectedFeederId && (
          <Link
            component="button"
            variant="body2"
            onClick={onSelectFeeder}
            color={!selectedTransformerId ? 'text.primary' : 'inherit'}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: !selectedTransformerId ? 600 : 400 }}
          >
            <PowerIcon fontSize="inherit" color="primary" />
            {selectedFeederId}
          </Link>
        )}

        {selectedTransformerId && (
          <Link
            component="button"
            variant="body2"
            onClick={onSelectTransformer}
            color={!selectedPoleId ? 'text.primary' : 'inherit'}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: !selectedPoleId ? 600 : 400 }}
          >
            <TransformIcon fontSize="inherit" color="info" />
            {selectedTransformerId}
          </Link>
        )}

        {selectedPoleId && (
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
          >
            <LocationOnIcon fontSize="inherit" color="warning" />
            {selectedPoleId}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
};
