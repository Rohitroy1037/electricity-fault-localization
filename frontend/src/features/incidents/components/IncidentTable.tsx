// src/features/incidents/components/IncidentTable.tsx

import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Paper,
  Box,
} from '@mui/material';
import { Incident } from '../types/incident.types';
import { IncidentStatusChip } from './IncidentStatusChip';
import { IncidentSeverityChip } from './IncidentSeverityChip';
import { IncidentSkeleton } from './IncidentSkeleton';

interface IncidentTableProps {
  incidents: Incident[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (property: string) => void;
  onRowClick: (id: string) => void;
}

interface ColumnConfig {
  id: string;
  label: string;
  sortable: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'id', label: 'ID', sortable: false },
  { id: 'title', label: 'Title', sortable: true },
  { id: 'severity', label: 'Severity', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'location', label: 'Location', sortable: true },
  { id: 'createdAt', label: 'Reported At', sortable: true },
];

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}) => {
  const createSortHandler = (property: string) => () => {
    onSort(property);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="incidents table">
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell
                key={column.id}
                sortDirection={sortBy === column.id ? sortOrder : false}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortOrder : 'asc'}
                    onClick={createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <IncidentSkeleton rowsCount={5} colsCount={COLUMNS.length} />
          ) : (
            incidents.map((incident) => (
              <TableRow
                key={incident.id}
                hover
                onClick={() => onRowClick(incident.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {typeof incident?.id === 'string' ? incident.id : String(incident?.id || '-')}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {incident.title}
                </TableCell>
                <TableCell>
                  <IncidentSeverityChip severity={incident.severity} />
                </TableCell>
                <TableCell>
                  <IncidentStatusChip status={incident.status} />
                </TableCell>
                <TableCell>{incident.location || '-'}</TableCell>
                <TableCell>
                  {new Date(incident.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
