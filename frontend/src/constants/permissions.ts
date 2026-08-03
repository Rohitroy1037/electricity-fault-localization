// src/constants/permissions.ts
// Simple permission mapping for RBAC – each role gets an array of allowed route keys.

import { ROLES } from './roles';
import { ROUTES } from './routes';

type PermissionMap = {
  [key in keyof typeof ROLES]: Array<keyof typeof ROUTES>;
};

export const PERMISSIONS: PermissionMap = {
  ADMIN: Object.keys(ROUTES) as Array<keyof typeof ROUTES>,
  OPERATOR: [
    'DASHBOARD',
    'INCIDENTS',
    'TICKETS',
    'ANALYTICS',
    'TOPOLOGY',
    'SETTINGS',
  ],
  ANALYST: ['DASHBOARD', 'ANALYTICS', 'TOPOLOGY'],
  VIEWER: ['DASHBOARD'],
};
