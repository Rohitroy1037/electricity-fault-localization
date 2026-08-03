// src/features/dashboard/api/dashboard.api.ts

import axiosInstance from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import { DashboardSummary } from '../types/dashboard.types';

const mockDashboardSummary: DashboardSummary = {
  kpis: {
    activeIncidents: 4,
    openTickets: 7,
    criticalIncidents: 2,
    healthyFeeders: 12,
    affectedFeeders: 3,
    offlineDevices: 5,
    onlineDevices: 84,
    activeFaults: 3,
  },
  feederStatus: [
    { id: 'FEEDER-01', name: 'Feeder 01 - Industrial Substation', status: 'faulted', load: 88 },
    { id: 'FEEDER-02', name: 'Feeder 02 - Residential North', status: 'offline', load: 74 },
    { id: 'FEEDER-03', name: 'Feeder 03 - Commercial District', status: 'online', load: 52 },
    { id: 'FEEDER-04', name: 'Feeder 04 - Tech Park Substation', status: 'online', load: 45 },
    { id: 'FEEDER-05', name: 'Feeder 05 - Western Grid Trunk', status: 'online', load: 79 },
  ],
  systemHealth: {
    status: 'degraded',
    score: 87,
  },
  recentEvents: [
    { id: 'evt-1', type: 'incident', title: 'Phase A-to-Ground Fault on Feeder-01 Pole P-104', status: 'CRITICAL', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'evt-2', type: 'ticket', title: 'Ticket TCK-2026-004 created for Crew Alpha', status: 'HIGH', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 'evt-3', type: 'incident', title: 'IoT Pole Monitor P-208 telemetry interrupted', status: 'MEDIUM', timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
    { id: 'evt-4', type: 'ticket', title: 'Transient fault cleared automatically on Feeder-03', status: 'INFO', timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
  ],
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.DASHBOARD.SUMMARY);
    const data = response.data?.data || response.data;
    if (data && data.kpis && (data.kpis.activeIncidents !== undefined || data.feederStatus?.length)) {
      return data as DashboardSummary;
    }
    return mockDashboardSummary;
  } catch {
    return mockDashboardSummary;
  }
};
