// src/features/ai/hooks/useAIChat.ts

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChatMessage } from '../types/ai.types';
import { sendChatMessage } from '../api/ai.api';

const initialWelcomeMessage: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `### ⚡ Welcome to PROPEL Grid Intelligence AI Assistant

I am your real-time grid co-pilot. I analyze telemetry stream data, electrical topology graphs, incident logs, and IEEE 1366 reliability indices.

**Quick Operations Prompts:**
- *Which pole is faulty?*
- *Why is electricity off on Pole P-104?*
- *Generate restoration plan for Pole P-104*
- *Summarize SAIDI and SAIFI metrics*`,
  timestamp: new Date().toISOString(),
  actionSuggestions: [
    'Which pole is faulty?',
    'Why is electricity off on Pole P-104?',
    'Generate restoration plan for Pole P-104',
    'Summarize SAIDI and SAIFI metrics',
  ],
};

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);

  const chatMutation = useMutation({
    mutationFn: async (promptText: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: promptText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);

      const assistantReply = await sendChatMessage(promptText, messages);
      setMessages((prev) => [...prev, assistantReply]);
      return assistantReply;
    },
  });

  const clearChat = () => {
    setMessages([initialWelcomeMessage]);
  };

  return {
    messages,
    sendMessage: chatMutation.mutateAsync,
    isPending: chatMutation.isPending,
    clearChat,
  };
};
