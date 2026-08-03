// src/features/topology/hooks/usePole.ts

import { useQuery } from '@tanstack/react-query';
import { fetchPoleById } from '../api/topology.api';
import { PoleNode } from '../types/topology.types';

export const POLE_QUERY_KEY = 'topologyPole';

export const usePole = (id: string, enabled = true) => {
  return useQuery<PoleNode, Error>({
    queryKey: [POLE_QUERY_KEY, id],
    queryFn: () => fetchPoleById(id),
    enabled: enabled && !!id,
    staleTime: 60000,
  });
};
