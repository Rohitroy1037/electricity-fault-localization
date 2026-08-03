// src/features/ai/components/AISuggestionChips.tsx

import React from 'react';
import { Box, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AISuggestionChipsProps {
  suggestions: string[];
  onSelectSuggestion: (text: string) => void;
  disabled?: boolean;
}

export const AISuggestionChips: React.FC<AISuggestionChipsProps> = ({
  suggestions,
  onSelectSuggestion,
  disabled = false,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Box display="flex" flexWrap="wrap" gap={1} my={1.5}>
      {suggestions.map((text, idx) => (
        <Chip
          key={idx}
          label={text}
          icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important' }} />}
          onClick={() => onSelectSuggestion(text)}
          disabled={disabled}
          variant="outlined"
          color="secondary"
          size="small"
          sx={{
            borderRadius: 3,
            cursor: 'pointer',
            bgcolor: 'rgba(168, 85, 247, 0.06)',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            '&:hover': {
              bgcolor: 'rgba(168, 85, 247, 0.15)',
              borderColor: 'secondary.main',
            },
          }}
        />
      ))}
    </Box>
  );
};
