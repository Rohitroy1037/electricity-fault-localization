import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../api/dashboard.api';
import { DashboardSummary } from '../types/dashboard.types';

export const DASHBOARD_QUERY_KEY = ['dashboardSummary'] as const;

export const useDashboard = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardSummary,
    // Dashboard data can be considered fresh for a bit unless invalidated by socket
    staleTime: 60 * 1000, // 1 minute
  });
};
