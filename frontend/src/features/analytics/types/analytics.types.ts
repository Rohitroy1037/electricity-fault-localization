// src/features/analytics/types/analytics.types.ts

export type GroupByInterval = 'day' | 'week' | 'month';

export type OutageType = 'SCHEDULED' | 'UNSCHEDULED';

export interface AnalyticsQueryParams {
  feederId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: GroupByInterval;
  page?: number;
  pageSize?: number;
  type?: OutageType | '';
  search?: string;
}

export interface AnalyticsSummary {
  totalIncidents: number;
  totalTickets: number;
  totalOutages: number;
  assetHealthScore: number;
  activeFaults?: number;
  resolvedFaults?: number;
}

export interface AvailabilityData {
  saidi: number; // System Average Interruption Duration Index (hours/mins)
  saifi: number; // System Average Interruption Frequency Index
  asai: number;  // Average System Availability Index (%)
  caidi: number; // Customer Average Interruption Duration Index
  uptimePercentage: number;
  feederAvailability?: Array<{
    feederId: string;
    feederName?: string;
    availability: number;
  }>;
}

export interface MTTRData {
  mttrMinutes: number; // Mean Time To Resolution
  mttaMinutes: number; // Mean Time To Acknowledge
  mttdMinutes: number; // Mean Time To Detect
  mttvMinutes: number; // Mean Time To Verify
  bySeverity?: Record<string, number>;
  byPriority?: Record<string, number>;
}

export interface TrendItem {
  timestamp: string;
  label: string;
  incidents: number;
  tickets: number;
  outages: number;
}

export interface TrendAnalyticsResponse {
  trends: TrendItem[];
  summary?: Record<string, number>;
}

export interface OutageItem {
  id: string;
  title: string;
  reason?: string;
  feederId?: string;
  type: OutageType;
  durationMinutes: number;
  affectedConsumers?: number;
  startTime: string;
  endTime?: string;
  status?: string;
}

export interface OutageAnalyticsResponse {
  data: OutageItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
