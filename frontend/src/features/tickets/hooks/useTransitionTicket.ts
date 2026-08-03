// src/features/tickets/hooks/useTransitionTicket.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transitionTicket } from '../api/ticket.api';
import { TicketTransitionPayload, Ticket } from '../types/ticket.types';
import { TICKETS_QUERY_KEY } from './useTickets';
import { TICKET_QUERY_KEY } from './useTicket';
import { TICKET_STATS_QUERY_KEY } from './useTicketStatistics';

export const useTransitionTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, { id: string; payload: TicketTransitionPayload }>({
    mutationFn: ({ id, payload }) => transitionTicket(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TICKET_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TICKET_STATS_QUERY_KEY] });
    },
  });
};
