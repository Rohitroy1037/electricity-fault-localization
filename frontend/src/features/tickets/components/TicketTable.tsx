// src/features/tickets/components/TicketTable.tsx

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
  Button,
  Box,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Ticket } from '../types/ticket.types';
import { TicketStatusChip } from './TicketStatusChip';
import { TicketPriorityChip } from './TicketPriorityChip';
import { VerificationStatusChip } from './VerificationStatusChip';
import { TicketSkeleton } from './TicketSkeleton';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (property: string) => void;
  onRowClick: (id: string) => void;
  onTransitionClick: (ticket: Ticket, e: React.MouseEvent) => void;
}

interface ColumnConfig {
  id: string;
  label: string;
  sortable: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'ticket_no', label: 'Ticket Ref', sortable: false },
  { id: 'priority', label: 'Priority', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'verificationStatus', label: 'Verification', sortable: false },
  { id: 'assigned_crew', label: 'Assigned Crew', sortable: false },
  { id: 'created_at', label: 'Created At', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false },
];

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  onTransitionClick,
}) => {
  const createSortHandler = (property: string) => () => {
    onSort(property);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 750 }} aria-label="tickets table">
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
            <TicketSkeleton rowsCount={5} colsCount={COLUMNS.length} />
          ) : (
            tickets.map((ticket) => {
              const ticketRef =
                ticket.ticket_no || (typeof ticket?.id === 'string' ? ticket.id : String(ticket?.id || '-'));
              const crew = ticket.assignedCrew || ticket.assigned_crew || 'Unassigned';
              const createdDate =
                ticket.createdAt || ticket.created_at || ticket.detected_at;

              return (
                <TableRow
                  key={ticket.id}
                  hover
                  onClick={() => onRowClick(ticket.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {ticketRef}
                  </TableCell>
                  <TableCell>
                    <TicketPriorityChip priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <TicketStatusChip status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    <VerificationStatusChip status={ticket.verificationStatus} />
                  </TableCell>
                  <TableCell>{crew}</TableCell>
                  <TableCell>
                    {createdDate ? new Date(createdDate).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SwapHorizIcon />}
                      onClick={(e) => onTransitionClick(ticket, e)}
                    >
                      Transition
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
