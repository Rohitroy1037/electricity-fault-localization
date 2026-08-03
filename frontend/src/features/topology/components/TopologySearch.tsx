// src/features/topology/components/TopologySearch.tsx

import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface TopologySearchProps {
  search: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const TopologySearch: React.FC<TopologySearchProps> = ({
  search,
  onSearchChange,
  placeholder = 'Search Feeder, Transformer, Pole, Pincode...',
}) => {
  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== search) {
        onSearchChange(value);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value, search, onSearchChange]);

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => {
                setValue('');
                onSearchChange('');
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{ minWidth: 260 }}
    />
  );
};
