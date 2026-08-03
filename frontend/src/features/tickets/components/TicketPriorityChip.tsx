// src/features/tickets/components/TicketPriorityChip.tsx

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { TicketPriority } from '../types/ticket.types';

interface TicketPriorityChipProps extends Omit<ChipProps, 'color' | 'label'> {
  priority: TicketPriority;
}

export const TicketPriorityChip: React.FC<TicketPriorityChipProps> = ({
  priority,
  ...props
}) => {
  let color: ChipProps['color'] = 'default';

  switch (priority) {
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
      label={priority}
      color={color}
      size="small"
      {...props}
    />
  );
};
