// src/features/analytics/hooks/useMTTR.ts

import { useQuery } from '@tanstack/react-query';
import { fetchMTTR } from '../api/analytics.api';
import { AnalyticsQueryParams, MTTRData } from '../types/analytics.types';

export const MTTR_QUERY_KEY = 'analyticsMTTR';

export const useMTTR = (params: AnalyticsQueryParams) => {
  return useQuery<MTTRData, Error>({
    queryKey: [MTTR_QUERY_KEY, params],
    queryFn: () => fetchMTTR(params),
    staleTime: 60000,
  });
};
