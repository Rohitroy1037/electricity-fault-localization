// src/constants/roles.ts
// Application role definitions for role‑based access control (RBAC).

export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

type RoleKey = keyof typeof ROLES;
export type Role = typeof ROLES[RoleKey];
