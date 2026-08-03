// src/features/incidents/hooks/useIncidentStatistics.ts

import { useQuery } from '@tanstack/react-query';
import { fetchIncidentStatistics } from '../api/incident.api';

export const INCIDENT_STATS_QUERY_KEY = 'incidentStatistics';

export const useIncidentStatistics = () => {
  return useQuery({
    queryKey: [INCIDENT_STATS_QUERY_KEY],
    queryFn: fetchIncidentStatistics,
    staleTime: 30000,
  });
};
