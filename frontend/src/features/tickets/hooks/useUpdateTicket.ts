// src/features/tickets/hooks/useUpdateTicket.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket } from '../api/ticket.api';
import { TicketUpdatePayload, Ticket } from '../types/ticket.types';
import { TICKETS_QUERY_KEY } from './useTickets';
import { TICKET_QUERY_KEY } from './useTicket';
import { TICKET_STATS_QUERY_KEY } from './useTicketStatistics';

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, { id: string; payload: TicketUpdatePayload }>({
    mutationFn: ({ id, payload }) => updateTicket(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TICKET_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TICKET_STATS_QUERY_KEY] });
    },
  });
};
