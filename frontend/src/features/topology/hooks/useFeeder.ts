// src/features/topology/hooks/useFeeder.ts

import { useQuery } from '@tanstack/react-query';
import { fetchFeederById } from '../api/topology.api';
import { FeederNode } from '../types/topology.types';

export const FEEDER_QUERY_KEY = 'topologyFeeder';

export const useFeeder = (id: string, include?: string, enabled = true) => {
  return useQuery<FeederNode, Error>({
    queryKey: [FEEDER_QUERY_KEY, id, include],
    queryFn: () => fetchFeederById(id, include),
    enabled: enabled && !!id,
    staleTime: 60000,
  });
};
