// src/features/incidents/components/IncidentSkeleton.tsx

import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

interface IncidentSkeletonProps {
  rowsCount?: number;
  colsCount?: number;
}

export const IncidentSkeleton: React.FC<IncidentSkeletonProps> = ({
  rowsCount = 5,
  colsCount = 6,
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
