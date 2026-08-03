// src/features/topology/components/TopologyFilters.tsx

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
import { PoleStatus } from '../types/topology.types';

interface TopologyFiltersProps {
  viewScope: 'ALL' | 'FEEDERS' | 'TRANSFORMERS' | 'POLES';
  ward: string;
  status: PoleStatus | '';
  onViewScopeChange: (scope: 'ALL' | 'FEEDERS' | 'TRANSFORMERS' | 'POLES') => void;
  onWardChange: (ward: string) => void;
  onStatusChange: (status: PoleStatus | '') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const TopologyFilters: React.FC<TopologyFiltersProps> = ({
  viewScope,
  ward,
  status,
  onViewScopeChange,
  onWardChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="topology-scope-label">Entity Scope</InputLabel>
        <Select
          labelId="topology-scope-label"
          id="topology-scope-select"
          value={viewScope}
          label="Entity Scope"
          onChange={(e: SelectChangeEvent) =>
            onViewScopeChange(e.target.value as 'ALL' | 'FEEDERS' | 'TRANSFORMERS' | 'POLES')
          }
        >
          <MenuItem value="ALL">All Nodes</MenuItem>
          <MenuItem value="FEEDERS">Feeders Only</MenuItem>
          <MenuItem value="TRANSFORMERS">Transformers Only</MenuItem>
          <MenuItem value="POLES">Poles Only</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="topology-ward-label">Ward Zone</InputLabel>
        <Select
          labelId="topology-ward-label"
          id="topology-ward-select"
          value={ward}
          label="Ward Zone"
          onChange={(e: SelectChangeEvent) => onWardChange(e.target.value)}
        >
          <MenuItem value="">All Wards</MenuItem>
          <MenuItem value="WARD-01">Ward 01</MenuItem>
          <MenuItem value="WARD-02">Ward 02</MenuItem>
          <MenuItem value="WARD-03">Ward 03</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="topology-status-label">Pole Status</InputLabel>
        <Select
          labelId="topology-status-label"
          id="topology-status-select"
          value={status}
          label="Pole Status"
          onChange={(e: SelectChangeEvent) =>
            onStatusChange(e.target.value as PoleStatus | '')
          }
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="ENERGIZED">Energized</MenuItem>
          <MenuItem value="DE_ENERGIZED">De-Energized</MenuItem>
          <MenuItem value="UNKNOWN">Unknown</MenuItem>
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button variant="text" size="small" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};
