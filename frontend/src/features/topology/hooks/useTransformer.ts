// src/features/topology/hooks/useTransformer.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTransformerById } from '../api/topology.api';
import { TransformerNode } from '../types/topology.types';

export const TRANSFORMER_QUERY_KEY = 'topologyTransformer';

export const useTransformer = (id: string, include?: string, enabled = true) => {
  return useQuery<TransformerNode, Error>({
    queryKey: [TRANSFORMER_QUERY_KEY, id, include],
    queryFn: () => fetchTransformerById(id, include),
    enabled: enabled && !!id,
    staleTime: 60000,
  });
};
