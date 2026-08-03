// src/features/topology/hooks/usePoles.ts

import { useQuery } from '@tanstack/react-query';
import { fetchPoles } from '../api/topology.api';
import { PoleNode, TopologyQueryParams } from '../types/topology.types';

export const POLES_QUERY_KEY = 'topologyPoles';

export const usePoles = (params?: TopologyQueryParams) => {
  return useQuery<PoleNode[], Error>({
    queryKey: [POLES_QUERY_KEY, params],
    queryFn: () => fetchPoles(params),
    staleTime: 60000,
  });
};
