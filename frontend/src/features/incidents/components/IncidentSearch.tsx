// src/features/incidents/components/IncidentSearch.tsx

import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface IncidentSearchProps {
  value: string;
  onSearch: (searchTerm: string) => void;
  debounceMs?: number;
}

export const IncidentSearch: React.FC<IncidentSearchProps> = ({
  value,
  onSearch,
  debounceMs = 500,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onSearch, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onSearch('');
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search incidents..."
      value={localValue}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: localValue && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} edge="end">
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: 300, width: '100%' }}
    />
  );
};
