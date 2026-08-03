// src/features/tickets/components/TicketTransitionDialog.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Ticket, TicketStatus } from '../types/ticket.types';
import { useTransitionTicket } from '../hooks/useTransitionTicket';
import { TicketStatusChip } from './TicketStatusChip';

interface TicketTransitionDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
}

const ALL_STATUSES: TicketStatus[] = [
  'DETECTED',
  'ACKNOWLEDGED',
  'CREW_ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'VERIFIED',
  'CLOSED',
];

export const TicketTransitionDialog: React.FC<TicketTransitionDialogProps> = ({
  ticket,
  open,
  onClose,
}) => {
  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('');
  const [performedBy, setPerformedBy] = useState('Operator');
  const [comment, setComment] = useState('');
  const transitionMutation = useTransitionTicket();

  useEffect(() => {
    if (ticket) {
      // Preselect next logical status in workflow sequence
      const currentIndex = ALL_STATUSES.indexOf(ticket.status);
      if (currentIndex !== -1 && currentIndex < ALL_STATUSES.length - 1) {
        setNewStatus(ALL_STATUSES[currentIndex + 1]);
      } else {
        setNewStatus('');
      }
      setComment('');
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newStatus) return;

    try {
      await transitionMutation.mutateAsync({
        id: ticket.id,
        payload: {
          newStatus: newStatus as TicketStatus,
          performedBy: performedBy.trim() || 'Operator',
          comment: comment.trim() || undefined,
        },
      });
      onClose();
    } catch {
      // Handled by mutation error state
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Transition Ticket Status</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2.5} pt={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Current Status:
              </Typography>
              <TicketStatusChip status={ticket.status} />
            </Box>

            {transitionMutation.isError && (
              <Alert severity="error">
                {transitionMutation.error?.message || 'Failed to transition status'}
              </Alert>
            )}

            <FormControl fullWidth size="small">
              <InputLabel id="new-status-label">New Status</InputLabel>
              <Select
                labelId="new-status-label"
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                required
              >
                {ALL_STATUSES.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    disabled={status === ticket.status}
                  >
                    {status ? String(status).replace(/_/g, ' ') : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Performed By"
              variant="outlined"
              size="small"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Comment / Transition Notes"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add optional notes for status change audit..."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={transitionMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!newStatus || transitionMutation.isPending}
            startIcon={
              transitionMutation.isPending ? <CircularProgress size={16} /> : null
            }
          >
            {transitionMutation.isPending ? 'Saving...' : 'Confirm Transition'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
