// src/features/analytics/components/AnalyticsFilters.tsx

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
import { GroupByInterval, OutageType } from '../types/analytics.types';

interface AnalyticsFiltersProps {
  feederId: string;
  groupBy: GroupByInterval;
  outageType: OutageType | '';
  onFeederChange: (feederId: string) => void;
  onGroupByChange: (groupBy: GroupByInterval) => void;
  onOutageTypeChange: (type: OutageType | '') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  feederId,
  groupBy,
  outageType,
  onFeederChange,
  onGroupByChange,
  onOutageTypeChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="analytics-feeder-label">Feeder</InputLabel>
        <Select
          labelId="analytics-feeder-label"
          id="analytics-feeder-select"
          value={feederId}
          label="Feeder"
          onChange={(e: SelectChangeEvent) => onFeederChange(e.target.value)}
        >
          <MenuItem value="">All Feeders</MenuItem>
          <MenuItem value="FEEDER-01">FEEDER-01</MenuItem>
          <MenuItem value="FEEDER-02">FEEDER-02</MenuItem>
          <MenuItem value="FEEDER-03">FEEDER-03</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="analytics-groupby-label">Group By</InputLabel>
        <Select
          labelId="analytics-groupby-label"
          id="analytics-groupby-select"
          value={groupBy}
          label="Group By"
          onChange={(e: SelectChangeEvent) =>
            onGroupByChange(e.target.value as GroupByInterval)
          }
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="analytics-outagetype-label">Outage Type</InputLabel>
        <Select
          labelId="analytics-outagetype-label"
          id="analytics-outagetype-select"
          value={outageType}
          label="Outage Type"
          onChange={(e: SelectChangeEvent) =>
            onOutageTypeChange(e.target.value as OutageType | '')
          }
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="SCHEDULED">Scheduled</MenuItem>
          <MenuItem value="UNSCHEDULED">Unscheduled</MenuItem>
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
