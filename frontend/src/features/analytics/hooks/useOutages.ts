// src/features/analytics/hooks/useOutages.ts

import { useQuery } from '@tanstack/react-query';
import { fetchOutages } from '../api/analytics.api';
import { AnalyticsQueryParams, OutageAnalyticsResponse } from '../types/analytics.types';

export const OUTAGES_QUERY_KEY = 'analyticsOutages';

export const useOutages = (params: AnalyticsQueryParams) => {
  return useQuery<OutageAnalyticsResponse, Error>({
    queryKey: [OUTAGES_QUERY_KEY, params],
    queryFn: () => fetchOutages(params),
    placeholderData: (previousData) => previousData,
    staleTime: 60000,
  });
};
