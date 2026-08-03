// src/features/analytics/hooks/useAvailability.ts

import { useQuery } from '@tanstack/react-query';
import { fetchAvailability } from '../api/analytics.api';
import { AnalyticsQueryParams, AvailabilityData } from '../types/analytics.types';

export const AVAILABILITY_QUERY_KEY = 'analyticsAvailability';

export const useAvailability = (params: AnalyticsQueryParams) => {
  return useQuery<AvailabilityData, Error>({
    queryKey: [AVAILABILITY_QUERY_KEY, params],
    queryFn: () => fetchAvailability(params),
    staleTime: 60000,
  });
};
