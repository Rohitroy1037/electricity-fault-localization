// src/features/analytics/hooks/useAnalyticsSummary.ts

import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsSummary } from '../api/analytics.api';
import { AnalyticsQueryParams, AnalyticsSummary } from '../types/analytics.types';

export const ANALYTICS_SUMMARY_QUERY_KEY = 'analyticsSummary';

export const useAnalyticsSummary = (params: AnalyticsQueryParams) => {
  return useQuery<AnalyticsSummary, Error>({
    queryKey: [ANALYTICS_SUMMARY_QUERY_KEY, params],
    queryFn: () => fetchAnalyticsSummary(params),
    staleTime: 60000,
  });
};
