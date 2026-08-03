// src/features/ai/hooks/useAIRestoration.ts

import { useQuery } from '@tanstack/react-query';
import { generateRestorationPlanAI } from '../api/ai.api';

export const AI_RESTORATION_KEY = 'ai_restoration';

export const useAIRestoration = (incidentId: string, enabled = true) => {
  return useQuery({
    queryKey: [AI_RESTORATION_KEY, incidentId],
    queryFn: () => generateRestorationPlanAI(incidentId),
    enabled: enabled && !!incidentId,
    staleTime: 60000,
  });
};
