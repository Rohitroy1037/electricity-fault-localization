// src/features/incidents/hooks/useIncident.ts

import { useQuery } from '@tanstack/react-query';
import { fetchIncidentById } from '../api/incident.api';

export const INCIDENT_QUERY_KEY = 'incident';

export const useIncident = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [INCIDENT_QUERY_KEY, id],
    queryFn: () => fetchIncidentById(id),
    enabled: enabled && !!id,
    staleTime: 30000,
  });
};
