// src/features/tickets/components/TicketSkeleton.tsx

import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

interface TicketSkeletonProps {
  rowsCount?: number;
  colsCount?: number;
}

export const TicketSkeleton: React.FC<TicketSkeletonProps> = ({
  rowsCount = 5,
  colsCount = 7,
}) => {
  return (
    <>
      {Array.from(new Array(rowsCount)).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from(new Array(colsCount)).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton animation="wave" height={24} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
