// src/features/analytics/components/DateRangePicker.tsx

import React from 'react';
import { Box, TextField } from '@mui/material';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <Box display="flex" gap={2} alignItems="center">
      <TextField
        label="Start Date"
        type="date"
        size="small"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ minWidth: 150 }}
      />
      <TextField
        label="End Date"
        type="date"
        size="small"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ minWidth: 150 }}
      />
    </Box>
  );
};
