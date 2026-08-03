// src/config/axios.ts
import axios from 'axios';
import { authStorage, invokeAuthLogout } from '../features/auth/utils/authStorage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

// Create Axios instance
const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

// Request interceptor – attach JWT if present
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Trigger logout via stored handler – avoids circular import
      invokeAuthLogout();
    }
    return Promise.reject(error);
  },
);

export default api;
