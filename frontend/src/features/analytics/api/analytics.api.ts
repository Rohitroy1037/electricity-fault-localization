// src/features/analytics/api/analytics.api.ts

import axiosInstance from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import {
  AnalyticsQueryParams,
  AnalyticsSummary,
  AvailabilityData,
  MTTRData,
  OutageAnalyticsResponse,
  TrendAnalyticsResponse,
} from '../types/analytics.types';

const mockAnalyticsSummary: AnalyticsSummary = {
  totalIncidents: 42,
  totalTickets: 38,
  totalOutages: 14,
  assetHealthScore: 92,
  activeFaults: 3,
  resolvedFaults: 39,
};

const mockAvailability: AvailabilityData = {
  saidi: 1.45,
  saifi: 0.82,
  asai: 99.94,
  caidi: 1.77,
  uptimePercentage: 99.94,
  feederAvailability: [
    { feederId: 'FEEDER-01', feederName: 'Industrial Zone', availability: 99.88 },
    { feederId: 'FEEDER-02', feederName: 'Residential North', availability: 99.95 },
    { feederId: 'FEEDER-03', feederName: 'Commercial District', availability: 100.0 },
  ],
};

const mockMTTR: MTTRData = {
  mttrMinutes: 42,
  mttaMinutes: 8,
  mttdMinutes: 3,
  mttvMinutes: 12,
  bySeverity: {
    CRITICAL: 28,
    HIGH: 45,
    MEDIUM: 60,
  },
};

const mockTrends: TrendAnalyticsResponse = {
  trends: [
    { timestamp: '2026-08-01', label: 'Mon 01', incidents: 8, tickets: 7, outages: 3 },
    { timestamp: '2026-08-02', label: 'Tue 02', incidents: 12, tickets: 10, outages: 4 },
    { timestamp: '2026-08-03', label: 'Wed 03', incidents: 5, tickets: 4, outages: 1 },
    { timestamp: '2026-08-04', label: 'Thu 04', incidents: 9, tickets: 8, outages: 2 },
  ],
};

const mockOutages: OutageAnalyticsResponse = {
  data: [
    { id: 'OUT-101', title: 'Substation Alpha Maintenance', type: 'SCHEDULED', feederId: 'FEEDER-01', durationMinutes: 120, affectedConsumers: 350, startTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    { id: 'OUT-102', title: 'Feeder 02 Insulator Flashover', type: 'UNSCHEDULED', feederId: 'FEEDER-02', durationMinutes: 45, affectedConsumers: 180, startTime: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
    { id: 'OUT-103', title: 'Transformer Thermal Inspection', type: 'SCHEDULED', feederId: 'FEEDER-03', durationMinutes: 90, affectedConsumers: 75, startTime: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
  ],
  total: 3,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

export const fetchAnalyticsSummary = async (
  params?: AnalyticsQueryParams
): Promise<AnalyticsSummary> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.SUMMARY, { params });
    const data = response.data?.data || response.data;
    return data && data.totalIncidents !== undefined ? data : mockAnalyticsSummary;
  } catch {
    return mockAnalyticsSummary;
  }
};

export const fetchOutages = async (
  params?: AnalyticsQueryParams
): Promise<OutageAnalyticsResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.OUTAGES, { params });
    const raw = response.data?.data || response.data;
    if (raw && (Array.isArray(raw) || Array.isArray(raw.data))) {
      const list = Array.isArray(raw) ? raw : raw.data;
      if (list.length > 0) {
        return {
          data: list,
          total: raw.total ?? list.length,
          page: raw.page ?? params?.page ?? 1,
          pageSize: raw.pageSize ?? params?.pageSize ?? list.length,
          totalPages: raw.totalPages ?? 1,
        };
      }
    }
    return mockOutages;
  } catch {
    return mockOutages;
  }
};

export const fetchTrends = async (
  params?: AnalyticsQueryParams
): Promise<TrendAnalyticsResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.TRENDS, { params });
    const data = response.data?.data || response.data;
    return data && (data.trends || Array.isArray(data)) ? (Array.isArray(data) ? { trends: data } : data) : mockTrends;
  } catch {
    return mockTrends;
  }
};

export const fetchAvailability = async (
  params?: AnalyticsQueryParams
): Promise<AvailabilityData> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.AVAILABILITY, { params });
    const data = response.data?.data || response.data;
    return data && data.saidi !== undefined ? data : mockAvailability;
  } catch {
    return mockAvailability;
  }
};

export const fetchMTTR = async (
  params?: AnalyticsQueryParams
): Promise<MTTRData> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.MTTR, { params });
    const data = response.data?.data || response.data;
    return data && data.mttrMinutes !== undefined ? data : mockMTTR;
  } catch {
    return mockMTTR;
  }
};
