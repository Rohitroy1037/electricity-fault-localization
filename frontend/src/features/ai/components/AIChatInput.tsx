// src/features/ai/components/AIChatInput.tsx

import React, { useState } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AIChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const AIChatInput: React.FC<AIChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box display="flex" gap={1.5} alignItems="center">
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Ask PROPEL AI for grid analysis, root cause, or restoration plans..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        variant="outlined"
        size="medium"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'background.paper',
          },
        }}
      />

      <IconButton
        color="secondary"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        sx={{
          bgcolor: 'secondary.main',
          color: '#FFF',
          p: 1.5,
          '&:hover': { bgcolor: 'secondary.dark' },
          '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
        }}
      >
        {disabled ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};
