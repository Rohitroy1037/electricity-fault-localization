// src/features/topology/hooks/useTransformers.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTransformers } from '../api/topology.api';
import { TopologyQueryParams, TransformerNode } from '../types/topology.types';

export const TRANSFORMERS_QUERY_KEY = 'topologyTransformers';

export const useTransformers = (params?: TopologyQueryParams) => {
  return useQuery<TransformerNode[], Error>({
    queryKey: [TRANSFORMERS_QUERY_KEY, params],
    queryFn: () => fetchTransformers(params),
    staleTime: 60000,
  });
};
