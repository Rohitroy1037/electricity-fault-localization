// src/pages/Incidents.tsx

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
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useIncidents } from '../features/incidents/hooks/useIncidents';
import { useIncidentStatistics } from '../features/incidents/hooks/useIncidentStatistics';
import { useIncidentSocket } from '../features/incidents/hooks/useIncidentSocket';
import { IncidentTable } from '../features/incidents/components/IncidentTable';
import { IncidentFilters } from '../features/incidents/components/IncidentFilters';
import { IncidentSearch } from '../features/incidents/components/IncidentSearch';
import { IncidentDetailsDrawer } from '../features/incidents/components/IncidentDetailsDrawer';
import { EmptyIncidents } from '../features/incidents/components/EmptyIncidents';
import { IncidentStatus, IncidentSeverity } from '../features/incidents/types/incident.types';

const Incidents: React.FC = () => {
  // 1. Pagination, Filtering, Sorting and Search State
  const [page, setPage] = useState(0); // MUI uses 0-indexed page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState<IncidentStatus | ''>('');
  const [severity, setSeverity] = useState<IncidentSeverity | ''>('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Drawer state
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 2. Fetch Data with React Query
  const queryParams = {
    page: page + 1, // API is 1-indexed
    limit: rowsPerPage,
    ...(status && { status }),
    ...(severity && { severity }),
    ...(search && { search }),
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError, error } = useIncidents(queryParams);
  const { data: stats, isLoading: isStatsLoading } = useIncidentStatistics();

  // 3. Socket Integration (Auto Invalidate cache)
  useIncidentSocket();

  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
    setPage(0); // Reset page to first page on sort change
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (newStatus: IncidentStatus | '') => {
    setStatus(newStatus);
    setPage(0);
  };

  const handleSeverityChange = (newSeverity: IncidentSeverity | '') => {
    setSeverity(newSeverity);
    setPage(0);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatus('');
    setSeverity('');
    setSearch('');
    setPage(0);
  };

  const handleRowClick = (id: string) => {
    setSelectedIncidentId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedIncidentId(null);
    setDrawerOpen(false);
  };

  const hasFiltersActive = !!(status || severity || search);
  const incidents = data?.data || [];
  const totalIncidents = data?.total || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Incident Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="error" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Open Incidents
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading ? '...' : stats?.open ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssignmentLateIcon color="warning" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading ? '...' : stats?.inProgress ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.dark' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Critical Severity
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.dark' }}>
                  {isStatsLoading ? '...' : stats?.critical ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Resolved Incidents
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {isStatsLoading ? '...' : stats?.resolved ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Table Container */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3} alignItems="center">
          <IncidentFilters
            status={status}
            severity={severity}
            onStatusChange={handleStatusChange}
            onSeverityChange={handleSeverityChange}
            onClearFilters={handleClearFilters}
            hasFiltersActive={hasFiltersActive}
          />
          <IncidentSearch value={search} onSearch={handleSearch} />
        </Box>

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load incidents: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        )}

        {!isLoading && !isError && incidents.length === 0 ? (
          <EmptyIncidents onClearFilters={handleClearFilters} hasFiltersActive={hasFiltersActive} />
        ) : (
          <>
            <IncidentTable
              incidents={incidents}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onRowClick={handleRowClick}
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalIncidents}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </Paper>

      {/* Detail Drawer */}
      <IncidentDetailsDrawer
        incidentId={selectedIncidentId}
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
    </Box>
  );
};

export default Incidents;
