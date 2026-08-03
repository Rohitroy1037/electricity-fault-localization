// src/features/ai/components/AIChatWindow.tsx

import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ChatMessage } from '../types/ai.types';
import { AIMessageItem } from './AIMessageItem';
import { AIChatInput } from './AIChatInput';

interface AIChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isPending?: boolean;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isPending = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 220px)',
        minHeight: 500,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ bgcolor: 'rgba(168, 85, 247, 0.05)', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <AutoAwesomeIcon color="secondary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>
              PROPEL AI Operator Assistant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-Time Grid Telemetry & Incident Intelligence Engine
            </Typography>
          </Box>
        </Box>

        <Button
          size="small"
          color="inherit"
          startIcon={<DeleteOutlineIcon />}
          onClick={onClearChat}
          sx={{ color: 'text.secondary' }}
        >
          Reset Session
        </Button>
      </Box>

      {/* Messages Scroll View */}
      <Box flex={1} p={3} overflow="auto">
        {messages.map((msg) => (
          <AIMessageItem
            key={msg.id}
            message={msg}
            onSelectSuggestion={onSendMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input Area */}
      <Box p={2} bgcolor="background.paper">
        <AIChatInput onSendMessage={onSendMessage} disabled={isPending} />
      </Box>
    </Paper>
  );
};
