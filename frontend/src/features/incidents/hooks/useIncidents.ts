// src/features/incidents/hooks/useIncidents.ts

import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '../api/incident.api';
import { IncidentQueryParams, Incident } from '../types/incident.types';

export const INCIDENTS_QUERY_KEY = 'incidents';

export const useIncidents = (params: IncidentQueryParams) => {
  return useQuery({
    queryKey: [INCIDENTS_QUERY_KEY, params],
    queryFn: () => fetchIncidents(params),
    placeholderData: (previousData) => previousData, // keep previous page data while loading the next
    staleTime: 30000, // 30 seconds
  });
};
