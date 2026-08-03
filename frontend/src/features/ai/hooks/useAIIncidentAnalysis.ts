// src/features/ai/hooks/useAIIncidentAnalysis.ts

import { useQuery } from '@tanstack/react-query';
import { analyzeIncidentAI } from '../api/ai.api';

export const AI_INCIDENT_ANALYSIS_KEY = 'ai_incident_analysis';

export const useAIIncidentAnalysis = (incidentId: string, enabled = true) => {
  return useQuery({
    queryKey: [AI_INCIDENT_ANALYSIS_KEY, incidentId],
    queryFn: () => analyzeIncidentAI(incidentId),
    enabled: enabled && !!incidentId,
    staleTime: 60000,
  });
};
