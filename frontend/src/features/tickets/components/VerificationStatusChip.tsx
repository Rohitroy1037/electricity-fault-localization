// src/features/tickets/components/VerificationStatusChip.tsx

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { VerificationStatus } from '../types/ticket.types';

interface VerificationStatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status?: VerificationStatus;
}

export const VerificationStatusChip: React.FC<VerificationStatusChipProps> = ({
  status = 'PENDING',
  ...props
}) => {
  let color: ChipProps['color'] = 'default';

  switch (status) {
    case 'VERIFIED':
      color = 'success';
      break;
    case 'FAILED':
      color = 'error';
      break;
    case 'PENDING':
    default:
      color = 'warning';
      break;
  }

  return (
    <Chip
      label={`VERIFICATION: ${status}`}
      color={color}
      size="small"
      variant="outlined"
      {...props}
    />
  );
};
