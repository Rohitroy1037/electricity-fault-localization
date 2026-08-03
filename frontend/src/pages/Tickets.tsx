// src/pages/Tickets.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TablePagination,
  Paper,
  Alert,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useTickets } from '../features/tickets/hooks/useTickets';
import { useTicketStatistics } from '../features/tickets/hooks/useTicketStatistics';
import { useTicketSocket } from '../features/tickets/hooks/useTicketSocket';
import { TicketTable } from '../features/tickets/components/TicketTable';
import { TicketFilters } from '../features/tickets/components/TicketFilters';
import { TicketSearch } from '../features/tickets/components/TicketSearch';
import { TicketDetailsDrawer } from '../features/tickets/components/TicketDetailsDrawer';
import { TicketTransitionDialog } from '../features/tickets/components/TicketTransitionDialog';
import { EmptyTickets } from '../features/tickets/components/EmptyTickets';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  VerificationStatus,
} from '../features/tickets/types/ticket.types';

const Tickets: React.FC = () => {
  // Query state
  const [page, setPage] = useState(0); // 0-indexed for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [priority, setPriority] = useState<TicketPriority | ''>('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | ''>('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Drawer & Modal state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transitionTicket, setTransitionTicket] = useState<Ticket | null>(null);
  const [transitionDialogOpen, setTransitionDialogOpen] = useState(false);

  // React Query
  const queryParams = {
    page: page + 1, // 1-indexed for backend API
    pageSize: rowsPerPage,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(verificationStatus && { verificationStatus }),
    ...(search && { search }),
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError, error } = useTickets(queryParams);
  const { data: stats, isLoading: isStatsLoading } = useTicketStatistics();

  // Socket auto refresh
  useTicketSocket();

  // Handlers
  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatus('');
    setPriority('');
    setVerificationStatus('');
    setSearch('');
    setPage(0);
  };

  const handleRowClick = (id: string) => {
    setSelectedTicketId(id);
    setDrawerOpen(true);
  };

  const handleTransitionClick = (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    setTransitionTicket(ticket);
    setTransitionDialogOpen(true);
  };

  const hasFiltersActive = !!(status || priority || verificationStatus || search);
  const tickets = data?.data || [];
  const totalTickets = data?.total || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Ticket Management
      </Typography>

      {/* KPI Stats Panel */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ConfirmationNumberIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading ? '...' : stats?.total ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EngineeringIcon color="info" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Crew Assigned
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading ? '...' : stats?.crewAssigned ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BuildIcon color="warning" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Detected / Open
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading ? '...' : stats?.detected ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Resolved & Verified
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading
                    ? '...'
                    : (stats?.resolved ?? 0) + (stats?.verified ?? 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Table Container */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          mb={3}
          alignItems="center"
        >
          <TicketFilters
            status={status}
            priority={priority}
            verificationStatus={verificationStatus}
            onStatusChange={(val) => {
              setStatus(val);
              setPage(0);
            }}
            onPriorityChange={(val) => {
              setPriority(val);
              setPage(0);
            }}
            onVerificationChange={(val) => {
              setVerificationStatus(val);
              setPage(0);
            }}
            onClearFilters={handleClearFilters}
            hasFiltersActive={hasFiltersActive}
          />
          <TicketSearch
            value={search}
            onSearch={(val) => {
              setSearch(val);
              setPage(0);
            }}
          />
        </Box>

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load tickets: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        )}

        {!isLoading && !isError && tickets.length === 0 ? (
          <EmptyTickets
            onClearFilters={handleClearFilters}
            hasFiltersActive={hasFiltersActive}
          />
        ) : (
          <>
            <TicketTable
              tickets={tickets}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onRowClick={handleRowClick}
              onTransitionClick={handleTransitionClick}
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalTickets}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </Paper>

      {/* Details Drawer */}
      <TicketDetailsDrawer
        ticketId={selectedTicketId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTicketId(null);
        }}
        onOpenTransition={() => {
          if (selectedTicketId) {
            // Find ticket from list or fallback
            const t = tickets.find((x) => x.id === selectedTicketId) || null;
            if (t) {
              setTransitionTicket(t);
              setTransitionDialogOpen(true);
            }
          }
        }}
      />

      {/* Transition Modal */}
      <TicketTransitionDialog
        ticket={transitionTicket}
        open={transitionDialogOpen}
        onClose={() => {
          setTransitionDialogOpen(false);
          setTransitionTicket(null);
        }}
      />
    </Box>
  );
};

export default Tickets;
