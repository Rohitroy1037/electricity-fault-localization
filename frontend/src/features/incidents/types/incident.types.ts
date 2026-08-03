// src/features/incidents/types/incident.types.ts

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Incident {
  id: string;
  title: string;
  description?: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  feederId?: string;
  location?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentStatistics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface IncidentQueryParams {
  page?: number;
  limit?: number;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
