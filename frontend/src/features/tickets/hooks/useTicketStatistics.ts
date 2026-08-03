// src/features/tickets/hooks/useTicketStatistics.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTicketStatistics } from '../api/ticket.api';
import { TicketStatistics } from '../types/ticket.types';

export const TICKET_STATS_QUERY_KEY = 'ticketStatistics';

export const useTicketStatistics = () => {
  return useQuery<TicketStatistics, Error>({
    queryKey: [TICKET_STATS_QUERY_KEY],
    queryFn: fetchTicketStatistics,
    staleTime: 30000,
  });
};
