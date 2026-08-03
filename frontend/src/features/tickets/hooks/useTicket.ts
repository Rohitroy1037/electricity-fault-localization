// src/features/tickets/hooks/useTicket.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTicketById } from '../api/ticket.api';
import { Ticket } from '../types/ticket.types';

export const TICKET_QUERY_KEY = 'ticket';

export const useTicket = (id: string, enabled = true) => {
  return useQuery<Ticket, Error>({
    queryKey: [TICKET_QUERY_KEY, id],
    queryFn: () => fetchTicketById(id),
    enabled: enabled && !!id,
    staleTime: 30000,
  });
};
