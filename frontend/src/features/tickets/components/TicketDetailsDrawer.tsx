// src/features/tickets/components/TicketDetailsDrawer.tsx

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  CircularProgress,
  Button,
  TextField,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import NoteIcon from '@mui/icons-material/Note';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useTicket } from '../hooks/useTicket';
import { useUpdateTicket } from '../hooks/useUpdateTicket';
import { TicketStatusChip } from './TicketStatusChip';
import { TicketPriorityChip } from './TicketPriorityChip';
import { VerificationStatusChip } from './VerificationStatusChip';

interface TicketDetailsDrawerProps {
  ticketId: string | null;
  open: boolean;
  onClose: () => void;
  onOpenTransition: () => void;
}

export const TicketDetailsDrawer: React.FC<TicketDetailsDrawerProps> = ({
  ticketId,
  open,
  onClose,
  onOpenTransition,
}) => {
  const { data: ticket, isLoading, isError } = useTicket(ticketId || '', open);
  const updateMutation = useUpdateTicket();

  // Edit Metadata State
  const [isEditing, setIsEditing] = useState(false);
  const [assignedOperator, setAssignedOperator] = useState('');
  const [assignedCrew, setAssignedCrew] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (ticket) {
      setAssignedOperator(ticket.assignedOperator || '');
      setAssignedCrew(ticket.assignedCrew || ticket.assigned_crew || '');
      setNotes(ticket.notes || ticket.crew_notes || '');
      setTagsInput(ticket.tags ? ticket.tags.join(', ') : '');
      setIsEditing(false);
    }
  }, [ticket]);

  const handleSaveMetadata = async () => {
    if (!ticketId) return;
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await updateMutation.mutateAsync({
        id: ticketId,
        payload: {
          assignedOperator: assignedOperator.trim() || undefined,
          assignedCrew: assignedCrew.trim() || undefined,
          notes: notes.trim() || undefined,
          tags: tagsArray,
        },
      });
      setIsEditing(false);
    } catch {
      // Handled by updateMutation error
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '100vw', sm: 500 },
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Ticket Details</Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
            <CircularProgress />
          </Box>
        ) : isError || !ticket ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1} flexDirection="column" gap={2}>
            <Typography color="error">Failed to load ticket details.</Typography>
            <Button variant="outlined" onClick={onClose}>Close</Button>
          </Box>
        ) : (
          <Box flex={1} overflow="auto" pr={1}>
            {/* Header info */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {ticket.ticket_no || (typeof ticket?.id === 'string' ? ticket.id : String(ticket?.id || '-'))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fault ID: {ticket.fault_id || 'N/A'}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<SwapHorizIcon />}
                onClick={onOpenTransition}
              >
                Transition
              </Button>
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
              <TicketPriorityChip priority={ticket.priority} />
              <TicketStatusChip status={ticket.status} />
              <VerificationStatusChip status={ticket.verificationStatus} />
            </Box>

            {/* Metadata Section Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Editable Metadata
              </Typography>
              {!isEditing ? (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => setIsEditing(false)}
                    disabled={updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={updateMutation.isPending ? <CircularProgress size={14} /> : <SaveIcon />}
                    onClick={handleSaveMetadata}
                    disabled={updateMutation.isPending}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>

            {updateMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {updateMutation.error?.message || 'Failed to update metadata'}
              </Alert>
            )}

            {/* Metadata Form / Fields */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Assigned Operator
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={assignedOperator}
                      onChange={(e) => setAssignedOperator(e.target.value)}
                      placeholder="e.g. Operator #402"
                    />
                  ) : (
                    <Typography variant="body2">
                      {ticket.assignedOperator || 'Unassigned'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <GroupsIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Assigned Crew
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={assignedCrew}
                      onChange={(e) => setAssignedCrew(e.target.value)}
                      placeholder="e.g. Crew Alpha"
                    />
                  ) : (
                    <Typography variant="body2">
                      {ticket.assignedCrew || ticket.assigned_crew || 'Unassigned'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <NoteIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Notes
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add crew or operator notes..."
                    />
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {ticket.notes || ticket.crew_notes || 'No notes added.'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocalOfferIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Tags
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Comma-separated tags e.g. urgent, high-voltage"
                    />
                  ) : (
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {ticket.tags && ticket.tags.length > 0 ? (
                        ticket.tags.map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No tags.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Readonly Audit & System Timestamps */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Timestamps & Audit
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created At
                    </Typography>
                    <Typography variant="body2">
                      {ticket.createdAt || ticket.created_at
                        ? new Date((ticket.createdAt || ticket.created_at)!).toLocaleString()
                        : '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last Modified
                    </Typography>
                    <Typography variant="body2">
                      {ticket.updatedAt || ticket.updated_at
                        ? new Date((ticket.updatedAt || ticket.updated_at)!).toLocaleString()
                        : '-'}
                    </Typography>
                  </Box>
                </Grid>

                {ticket.resolved_at && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Resolved At
                    </Typography>
                    <Typography variant="body2">
                      {new Date(ticket.resolved_at).toLocaleString()}
                    </Typography>
                  </Grid>
                )}

                {ticket.closed_at && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Closed At
                    </Typography>
                    <Typography variant="body2">
                      {new Date(ticket.closed_at).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
