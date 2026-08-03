// src/constants/api.ts
// Centralized API endpoint paths for the authentication feature.

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me', // optional endpoint to fetch current user info
    REFRESH: '/api/auth/refresh', // placeholder for future refresh token flow
  },
  DASHBOARD: {
    SUMMARY: '/api/v1/dashboard/summary',
  },
  INCIDENTS: {
    BASE: '/api/v1/incidents',
    OPEN: '/api/v1/incidents/open',
    STATISTICS: '/api/v1/incidents/statistics',
  },
  TICKETS: {
    BASE: '/api/v1/tickets',
    STATISTICS: '/api/v1/tickets/statistics',
  },
  ANALYTICS: {
    SUMMARY: '/api/v1/analytics/summary',
    OUTAGES: '/api/v1/analytics/outages',
    TRENDS: '/api/v1/analytics/trends',
    AVAILABILITY: '/api/v1/analytics/availability',
    MTTR: '/api/v1/analytics/mttr',
  },
  TOPOLOGY: {
    FEEDERS: '/api/v1/topology/feeders',
    TRANSFORMERS: '/api/v1/topology/transformers',
    POLES: '/api/v1/topology/poles',
  },
} as const;
