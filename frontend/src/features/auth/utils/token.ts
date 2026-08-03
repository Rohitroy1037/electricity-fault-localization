// src/features/auth/utils/token.ts
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../types/auth.types';

/**
 * Decode a JWT token without verification.
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

/**
 * Check whether a JWT token is expired.
 * The `exp` claim is in seconds since epoch.
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};
