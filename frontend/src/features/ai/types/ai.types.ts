// src/features/ai/types/ai.types.ts

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  actionSuggestions?: string[];
  contextIncidentId?: string;
}

export interface IncidentAnalysisRequest {
  incidentId: string;
  includeTelemetry?: boolean;
}

export interface IncidentAnalysisResponse {
  incidentId: string;
  summary: string;
  probableCauses: {
    cause: string;
    confidence: number;
    description: string;
  }[];
  affectedAssets: {
    assetId: string;
    assetType: 'FEEDER' | 'TRANSFORMER' | 'POLE';
    status: string;
  }[];
  recommendations: string[];
}

export interface RestorationPlanRequest {
  incidentId: string;
}

export interface RestorationStep {
  stepNumber: number;
  action: string;
  targetAsset: string;
  estimatedTimeMinutes: number;
  safetyPrecaution: string;
}

export interface RestorationPlanResponse {
  incidentId: string;
  feederId: string;
  totalEstimatedRestorationTimeMinutes: number;
  isolationSteps: RestorationStep[];
  backfeedOptions: {
    sourceFeederId: string;
    availableCapacityMva: number;
    switchingActions: string[];
  }[];
  recommendedCrew: string;
}
