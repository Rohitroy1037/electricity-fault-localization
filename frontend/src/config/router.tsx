// src/config/router.tsx
// Central router component – defines route mappings only.
// BrowserRouter is provided by AppProviders; do NOT wrap in another BrowserRouter here.

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import Incidents from '../pages/Incidents';
import Tickets from '../pages/Tickets';
import Analytics from '../pages/Analytics';
import Topology from '../pages/Topology';
import AIAssistant from '../pages/AIAssistant';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import { ProtectedRoute } from '../components/routing/ProtectedRoute';

/**
 * Central router component. Uses React Router v6 to map paths to pages.
 * Layouts wrap groups of routes: MainLayout for authenticated sections,
 * AuthLayout for login/auth pages.
 */
const AppRouter: React.FC = () => (
  <Routes>
    {/* Public Routes */}
    <Route element={<AuthLayout />}>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
    </Route>
    
    <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.INCIDENTS} element={<Incidents />} />
        <Route path={ROUTES.TICKETS} element={<Tickets />} />
        <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
        <Route path={ROUTES.TOPOLOGY} element={<Topology />} />
        <Route path={ROUTES.AI_ASSISTANT} element={<AIAssistant />} />
        {/* Settings restricted to ADMIN role as an example of role-based protection */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>
    </Route>

    <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
  </Routes>
);

export default AppRouter;

