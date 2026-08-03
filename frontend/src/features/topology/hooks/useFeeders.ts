// src/features/topology/hooks/useFeeders.ts

import { useQuery } from '@tanstack/react-query';
import { fetchFeeders } from '../api/topology.api';
import { FeederNode, TopologyQueryParams } from '../types/topology.types';

export const FEEDERS_QUERY_KEY = 'topologyFeeders';

export const useFeeders = (params?: TopologyQueryParams) => {
  return useQuery<FeederNode[], Error>({
    queryKey: [FEEDERS_QUERY_KEY, params],
    queryFn: () => fetchFeeders(params),
    staleTime: 60000,
  });
};
