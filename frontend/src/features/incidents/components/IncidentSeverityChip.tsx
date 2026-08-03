// src/features/incidents/components/IncidentSeverityChip.tsx

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { IncidentSeverity } from '../types/incident.types';

interface IncidentSeverityChipProps extends Omit<ChipProps, 'color' | 'label'> {
  severity: IncidentSeverity;
}

export const IncidentSeverityChip: React.FC<IncidentSeverityChipProps> = ({
  severity,
  ...props
}) => {
  let color: ChipProps['color'] = 'default';

  switch (severity) {
    case 'CRITICAL':
      color = 'error';
      break;
    case 'HIGH':
      color = 'warning';
      break;
    case 'MEDIUM':
      color = 'info';
      break;
    case 'LOW':
      color = 'success';
      break;
  }

  return (
    <Chip
      label={severity}
      color={color}
      size="small"
      {...props}
    />
  );
};
