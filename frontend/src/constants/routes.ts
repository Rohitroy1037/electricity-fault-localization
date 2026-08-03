export const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/',
  INCIDENTS: '/incidents',
  TICKETS: '/tickets',
  ANALYTICS: '/analytics',
  TOPOLOGY: '/topology',
  AI_ASSISTANT: '/ai-assistant',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const;

type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
