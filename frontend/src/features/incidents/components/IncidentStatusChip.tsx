// src/features/incidents/components/IncidentStatusChip.tsx

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { IncidentStatus } from '../types/incident.types';

interface IncidentStatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: IncidentStatus;
}

export const IncidentStatusChip: React.FC<IncidentStatusChipProps> = ({
  status,
  ...props
}) => {
  let color: ChipProps['color'] = 'default';

  switch (status) {
    case 'OPEN':
      color = 'error';
      break;
    case 'IN_PROGRESS':
      color = 'warning';
      break;
    case 'RESOLVED':
      color = 'success';
      break;
    case 'CLOSED':
      color = 'default';
      break;
  }

  const labelText = typeof status === 'string' ? status.replace(/_/g, ' ') : String(status || 'UNKNOWN');

  return (
    <Chip
      label={labelText}
      color={color}
      size="small"
      variant="outlined"
      {...props}
    />
  );
};
