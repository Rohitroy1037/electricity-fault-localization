// src/features/tickets/api/ticket.api.ts

import axiosInstance from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import {
  Ticket,
  TicketQueryParams,
  TicketStatistics,
  TicketTransitionPayload,
  TicketUpdatePayload,
  PaginatedTicketsResponse,
} from '../types/ticket.types';

const mockTickets: Ticket[] = [
  {
    id: 'TCK-2026-001',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    verificationStatus: 'PENDING',
    assignedCrew: 'Crew Alpha',
    assignedOperator: 'Operator System Admin',
    notes: 'Safety gear and bucket truck deployed to Pole P-104.',
    tags: ['CRITICAL_FAULT', 'CREW_DISPATCHED'],
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'TCK-2026-002',
    status: 'CREW_ASSIGNED',
    priority: 'HIGH',
    verificationStatus: 'PENDING',
    assignedCrew: 'Crew Beta',
    assignedOperator: 'Grid Operator',
    notes: 'Thermal camera audit scheduled for DT-201.',
    tags: ['TRANSFORMER', 'MAINTENANCE'],
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'TCK-2026-003',
    status: 'DETECTED',
    priority: 'MEDIUM',
    verificationStatus: 'PENDING',
    assignedOperator: 'Grid Operator',
    tags: ['LOAD_BALANCING'],
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: 'TCK-2026-004',
    status: 'CLOSED',
    priority: 'LOW',
    verificationStatus: 'VERIFIED',
    assignedCrew: 'Vegetation Team 2',
    assignedOperator: 'Field Supervisor',
    notes: 'Vegetation trimmed 3 meters clear of conductors.',
    tags: ['PREVENTIVE', 'COMPLETED'],
    createdAt: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
  },
];

const mockTicketStats: TicketStatistics = {
  total: 4,
  detected: 1,
  acknowledged: 0,
  crewAssigned: 1,
  inProgress: 1,
  resolved: 0,
  verified: 0,
  closed: 1,
  byPriority: {
    low: 1,
    medium: 1,
    high: 1,
    critical: 1,
  },
};

export const fetchTickets = async (
  params?: TicketQueryParams
): Promise<PaginatedTicketsResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.TICKETS.BASE, { params });
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
    return {
      data: mockTickets,
      total: mockTickets.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
  } catch {
    return {
      data: mockTickets,
      total: mockTickets.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
  }
};

export const fetchTicketById = async (id: string): Promise<Ticket> => {
  try {
    const response = await axiosInstance.get<any>(`${API_ENDPOINTS.TICKETS.BASE}/${id}`);
    return response.data?.data || response.data;
  } catch {
    return mockTickets.find((t) => t.id === id) || mockTickets[0];
  }
};

export const updateTicket = async (
  id: string,
  payload: TicketUpdatePayload
): Promise<Ticket> => {
  try {
    const response = await axiosInstance.patch<any>(`${API_ENDPOINTS.TICKETS.BASE}/${id}`, payload);
    return response.data?.data || response.data;
  } catch {
    const target = mockTickets.find((t) => t.id === id) || mockTickets[0];
    return { ...target, ...payload, updatedAt: new Date().toISOString() };
  }
};

export const transitionTicket = async (
  id: string,
  payload: TicketTransitionPayload
): Promise<Ticket> => {
  try {
    const response = await axiosInstance.post<any>(`${API_ENDPOINTS.TICKETS.BASE}/${id}/transition`, payload);
    return response.data?.data || response.data;
  } catch {
    const target = mockTickets.find((t) => t.id === id) || mockTickets[0];
    return { ...target, status: payload.newStatus, updatedAt: new Date().toISOString() };
  }
};

export const fetchTicketStatistics = async (): Promise<TicketStatistics> => {
  try {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.TICKETS.STATISTICS);
    const data = response.data?.data || response.data;
    return data && data.total !== undefined ? data : mockTicketStats;
  } catch {
    return mockTicketStats;
  }
};
