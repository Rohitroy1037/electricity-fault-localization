// src/features/incidents/components/IncidentDetailsDrawer.tsx

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonIcon from '@mui/icons-material/Person';
import { useIncident } from '../hooks/useIncident';
import { IncidentStatusChip } from './IncidentStatusChip';
import { IncidentSeverityChip } from './IncidentSeverityChip';

interface IncidentDetailsDrawerProps {
  incidentId: string | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(dateVal?: string): string {
  if (!dateVal) return 'N/A';
  const d = new Date(dateVal);
  return !isNaN(d.getTime()) ? d.toLocaleString() : 'N/A';
}

export const IncidentDetailsDrawer: React.FC<IncidentDetailsDrawerProps> = ({
  incidentId,
  open,
  onClose,
}) => {
  const { data: rawIncident, isLoading, isError } = useIncident(incidentId || '', open);

  // Safely unwrap nested response object if needed
  const incident: any = (rawIncident as any)?.incident || rawIncident;

  const displayId = incident?.id || incidentId || 'N/A';
  const displayTitle = incident?.title || 'Incident Details';
  const displayStatus = incident?.status || 'OPEN';
  const displaySeverity = incident?.severity || 'MEDIUM';
  const displayDesc = incident?.description || 'No description provided.';
  const displayLocation = incident?.location || 'Not Specified';
  const displayFeeder = incident?.feederId || incident?.feeder_id || 'N/A';
  const displayAssigned = incident?.assignedTo || incident?.assigned_to || 'Unassigned';
  const displayCreated = formatDate(incident?.createdAt || incident?.created_at);
  const displayUpdated = formatDate(incident?.updatedAt || incident?.updated_at);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 450 }, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Incident Details</Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
            <CircularProgress />
          </Box>
        ) : isError || !incident ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1} flexDirection="column" gap={2}>
            <Typography color="error">Failed to load incident details.</Typography>
            <Button variant="outlined" onClick={onClose}>Close</Button>
          </Box>
        ) : (
          <Box flex={1} overflow="auto">
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {displayTitle}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ID: {displayId}
            </Typography>

            <Box display="flex" gap={1} my={2} flexWrap="wrap">
              <IncidentStatusChip status={displayStatus} />
              <IncidentSeverityChip severity={displaySeverity} />
            </Box>

            <Typography variant="subtitle2" color="text.secondary" mt={3} gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {displayDesc}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" alignItems="center" gap={1}>
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {displayLocation}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} display="flex" alignItems="center" gap={1}>
                <PowerSettingsNewIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Feeder ID
                  </Typography>
                  <Typography variant="body2">
                    {displayFeeder}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} display="flex" alignItems="center" gap={1}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Assigned To
                  </Typography>
                  <Typography variant="body2">
                    {displayAssigned}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} display="flex" alignItems="center" gap={1}>
                <CalendarTodayIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Reported At
                  </Typography>
                  <Typography variant="body2">
                    {displayCreated}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} display="flex" alignItems="center" gap={1}>
                <CalendarTodayIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {displayUpdated}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
