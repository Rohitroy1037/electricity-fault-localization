import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../../../config/socket-client';
import { DASHBOARD_QUERY_KEY } from './useDashboard';

export const useDashboardSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const invalidateDashboard = () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    };

    // Listen to dashboard specific events
    socket.on('dashboard_updated', invalidateDashboard);
    socket.on('incident_created', invalidateDashboard);
    socket.on('incident_updated', invalidateDashboard);
    socket.on('ticket_created', invalidateDashboard);
    socket.on('ticket_updated', invalidateDashboard);

    return () => {
      socket.off('dashboard_updated', invalidateDashboard);
      socket.off('incident_created', invalidateDashboard);
      socket.off('incident_updated', invalidateDashboard);
      socket.off('ticket_created', invalidateDashboard);
      socket.off('ticket_updated', invalidateDashboard);
    };
  }, [queryClient]);
};
