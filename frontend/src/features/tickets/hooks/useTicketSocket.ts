// src/features/tickets/hooks/useTicketSocket.ts

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../../../config/socket-client';
import { TICKETS_QUERY_KEY } from './useTickets';
import { TICKET_QUERY_KEY } from './useTicket';
import { TICKET_STATS_QUERY_KEY } from './useTicketStatistics';

export const useTicketSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleTicketChange = () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TICKET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TICKET_STATS_QUERY_KEY] });
    };

    socket.on('ticket_created', handleTicketChange);
    socket.on('ticket_updated', handleTicketChange);
    socket.on('ticket_transition', handleTicketChange);

    return () => {
      socket.off('ticket_created', handleTicketChange);
      socket.off('ticket_updated', handleTicketChange);
      socket.off('ticket_transition', handleTicketChange);
    };
  }, [queryClient]);
};
