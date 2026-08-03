// src/features/tickets/components/TicketStatusChip.tsx

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { TicketStatus } from '../types/ticket.types';

interface TicketStatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: TicketStatus;
}

export const TicketStatusChip: React.FC<TicketStatusChipProps> = ({
  status,
  ...props
}) => {
  let color: ChipProps['color'] = 'default';

  switch (status) {
    case 'DETECTED':
      color = 'info';
      break;
    case 'ACKNOWLEDGED':
      color = 'primary';
      break;
    case 'CREW_ASSIGNED':
      color = 'secondary';
      break;
    case 'IN_PROGRESS':
      color = 'warning';
      break;
    case 'RESOLVED':
      color = 'success';
      break;
    case 'VERIFIED':
      color = 'success';
      break;
    case 'CLOSED':
      color = 'default';
      break;
  }

  const formattedLabel = status ? status.replace(/_/g, ' ') : '';

  return (
    <Chip
      label={formattedLabel}
      color={color}
      size="small"
      variant="outlined"
      {...props}
    />
  );
};
