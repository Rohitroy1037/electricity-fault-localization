// src/features/ai/components/AIMessageItem.tsx

import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { ChatMessage } from '../types/ai.types';
import { AISuggestionChips } from './AISuggestionChips';

interface AIMessageItemProps {
  message: ChatMessage;
  onSelectSuggestion?: (text: string) => void;
}

export const AIMessageItem: React.FC<AIMessageItemProps> = ({
  message,
  onSelectSuggestion,
}) => {
  const isAssistant = message.role === 'assistant';

  return (
    <Box
      display="flex"
      flexDirection={isAssistant ? 'row' : 'row-reverse'}
      gap={1.5}
      mb={2.5}
      alignItems="flex-start"
    >
      <Avatar
        sx={{
          bgcolor: isAssistant ? 'secondary.main' : 'primary.main',
          width: 36,
          height: 36,
          boxShadow: isAssistant
            ? '0 0 12px rgba(168, 85, 247, 0.4)'
            : '0 0 12px rgba(59, 130, 246, 0.4)',
        }}
      >
        {isAssistant ? <SmartToyIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
      </Avatar>

      <Box maxWidth="82%">
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: isAssistant ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
            bgcolor: isAssistant ? 'background.paper' : 'primary.dark',
            color: isAssistant ? 'text.primary' : '#FFFFFF',
            border: '1px solid',
            borderColor: isAssistant ? 'rgba(255, 255, 255, 0.08)' : 'primary.main',
          }}
        >
          <Typography
            variant="body2"
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              '& h3': {
                fontSize: '1rem',
                fontWeight: 700,
                color: isAssistant ? 'secondary.light' : '#FFFFFF',
                my: 1,
              },
              '& ul': { pl: 2, my: 1 },
              '& li': { mb: 0.5 },
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, px: 1 }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>

        {isAssistant && message.actionSuggestions && onSelectSuggestion && (
          <AISuggestionChips
            suggestions={message.actionSuggestions}
            onSelectSuggestion={onSelectSuggestion}
          />
        )}
      </Box>
    </Box>
  );
};
