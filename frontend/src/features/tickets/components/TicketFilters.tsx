// src/features/tickets/components/TicketFilters.tsx

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { TicketStatus, TicketPriority, VerificationStatus } from '../types/ticket.types';

interface TicketFiltersProps {
  status: TicketStatus | '';
  priority: TicketPriority | '';
  verificationStatus: VerificationStatus | '';
  onStatusChange: (status: TicketStatus | '') => void;
  onPriorityChange: (priority: TicketPriority | '') => void;
  onVerificationChange: (verification: VerificationStatus | '') => void;
  onClearFilters: () => void;
  hasFiltersActive: boolean;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  status,
  priority,
  verificationStatus,
  onStatusChange,
  onPriorityChange,
  onVerificationChange,
  onClearFilters,
  hasFiltersActive,
}) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="ticket-status-label">Status</InputLabel>
        <Select
          labelId="ticket-status-label"
          id="ticket-status-select"
          value={status}
          label="Status"
          onChange={(e: SelectChangeEvent<TicketStatus | ''>) =>
            onStatusChange(e.target.value as TicketStatus | '')
          }
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="DETECTED">Detected</MenuItem>
          <MenuItem value="ACKNOWLEDGED">Acknowledged</MenuItem>
          <MenuItem value="CREW_ASSIGNED">Crew Assigned</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="RESOLVED">Resolved</MenuItem>
          <MenuItem value="VERIFIED">Verified</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="ticket-priority-label">Priority</InputLabel>
        <Select
          labelId="ticket-priority-label"
          id="ticket-priority-select"
          value={priority}
          label="Priority"
          onChange={(e: SelectChangeEvent<TicketPriority | ''>) =>
            onPriorityChange(e.target.value as TicketPriority | '')
          }
        >
          <MenuItem value="">All Priorities</MenuItem>
          <MenuItem value="CRITICAL">Critical</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="ticket-verification-label">Verification</InputLabel>
        <Select
          labelId="ticket-verification-label"
          id="ticket-verification-select"
          value={verificationStatus}
          label="Verification"
          onChange={(e: SelectChangeEvent<VerificationStatus | ''>) =>
            onVerificationChange(e.target.value as VerificationStatus | '')
          }
        >
          <MenuItem value="">All Verification</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="VERIFIED">Verified</MenuItem>
          <MenuItem value="FAILED">Failed</MenuItem>
        </Select>
      </FormControl>

      {hasFiltersActive && (
        <Button variant="text" size="small" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};
