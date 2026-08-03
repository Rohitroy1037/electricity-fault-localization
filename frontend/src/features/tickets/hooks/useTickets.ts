// src/features/tickets/hooks/useTickets.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTickets } from '../api/ticket.api';
import { TicketQueryParams, PaginatedTicketsResponse } from '../types/ticket.types';

export const TICKETS_QUERY_KEY = 'tickets';

export const useTickets = (params: TicketQueryParams) => {
  return useQuery<PaginatedTicketsResponse, Error>({
    queryKey: [TICKETS_QUERY_KEY, params],
    queryFn: () => fetchTickets(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
};
