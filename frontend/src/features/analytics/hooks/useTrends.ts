// src/features/analytics/hooks/useTrends.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTrends } from '../api/analytics.api';
import { AnalyticsQueryParams, TrendAnalyticsResponse } from '../types/analytics.types';

export const TRENDS_QUERY_KEY = 'analyticsTrends';

export const useTrends = (params: AnalyticsQueryParams) => {
  return useQuery<TrendAnalyticsResponse, Error>({
    queryKey: [TRENDS_QUERY_KEY, params],
    queryFn: () => fetchTrends(params),
    staleTime: 60000,
  });
};
