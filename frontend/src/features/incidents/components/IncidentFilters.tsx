// src/features/incidents/components/IncidentFilters.tsx

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
import { IncidentStatus, IncidentSeverity } from '../types/incident.types';

interface IncidentFiltersProps {
  status: IncidentStatus | '';
  severity: IncidentSeverity | '';
  onStatusChange: (status: IncidentStatus | '') => void;
  onSeverityChange: (severity: IncidentSeverity | '') => void;
  onClearFilters: () => void;
  hasFiltersActive: boolean;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  status,
  severity,
  onStatusChange,
  onSeverityChange,
  onClearFilters,
  hasFiltersActive,
}) => {
  const handleStatusChange = (e: SelectChangeEvent<IncidentStatus | ''>) => {
    onStatusChange(e.target.value as IncidentStatus | '');
  };

  const handleSeverityChange = (e: SelectChangeEvent<IncidentSeverity | ''>) => {
    onSeverityChange(e.target.value as IncidentSeverity | '');
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="incident-status-filter-label">Status</InputLabel>
        <Select
          labelId="incident-status-filter-label"
          id="incident-status-filter"
          value={status}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="RESOLVED">Resolved</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="incident-severity-filter-label">Severity</InputLabel>
        <Select
          labelId="incident-severity-filter-label"
          id="incident-severity-filter"
          value={severity}
          label="Severity"
          onChange={handleSeverityChange}
        >
          <MenuItem value="">All Severities</MenuItem>
          <MenuItem value="CRITICAL">Critical</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
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
