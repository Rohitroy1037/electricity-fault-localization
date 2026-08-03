import React from 'react';
import { Box, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PowerIcon from '@mui/icons-material/Power';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useDashboardSocket } from '../features/dashboard/hooks/useDashboardSocket';
import { KpiCard } from '../features/dashboard/components/KpiCard';
import { RecentEvents } from '../features/dashboard/components/RecentEvents';
import { SystemHealth } from '../features/dashboard/components/SystemHealth';
import { FeederStatus } from '../features/dashboard/components/FeederStatus';

const Dashboard: React.FC = () => {
  // Use React Query for data fetching
  const { data, isLoading, isError, error } = useDashboard();
  
  // Initialize Socket.IO listeners
  useDashboardSocket();

  if (isError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load dashboard summary: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        {isLoading && <CircularProgress size={24} />}
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Active Incidents" 
            value={data?.kpis?.activeIncidents} 
            icon={<WarningIcon />} 
            color="error.main"
            isLoading={isLoading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Open Tickets" 
            value={data?.kpis?.openTickets} 
            icon={<ConfirmationNumberIcon />} 
            color="warning.main"
            isLoading={isLoading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Critical Incidents" 
            value={data?.kpis?.criticalIncidents} 
            icon={<ErrorOutlineIcon />} 
            color="error.dark"
            isLoading={isLoading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Active Faults" 
            value={data?.kpis?.activeFaults} 
            icon={<PowerIcon />} 
            color="secondary.main"
            isLoading={isLoading} 
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Box mb={3} height="100%">
            <FeederStatus feeders={data?.feederStatus} isLoading={isLoading} />
          </Box>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={3} height="100%">
            <Box flex={1}>
              <SystemHealth data={data?.systemHealth} isLoading={isLoading} />
            </Box>
            <Box flex={2}>
              <RecentEvents events={data?.recentEvents} isLoading={isLoading} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
