// src/features/auth/utils/authStorage.ts
/**
 * Simple wrapper around localStorage for authentication data.
 * All keys are namespaced under "auth_" to avoid collisions.
 */
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authStorage = {
  /** Save JWT token */
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  /** Retrieve JWT token */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  /** Remove JWT token */
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  /** Save user object (stringified) */
  setUser(user: object) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  /** Retrieve user object */
  getUser<T = any>(): T | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  /** Remove saved user */
  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
  /** Clear both token and user */
  clearAll() {
    this.clearToken();
    this.clearUser();
  },
};

// Export a setter for a logout callback used by axios interceptors.
let logoutCallback: (() => void) | null = null;
export const setAuthLogoutHandler = (fn: () => void) => {
  logoutCallback = fn;
};
export const invokeAuthLogout = () => {
  if (logoutCallback) logoutCallback();
};
