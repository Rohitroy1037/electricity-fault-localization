// src/features/incidents/hooks/useIncidentSocket.ts

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../../../config/socket-client';
import { INCIDENTS_QUERY_KEY } from './useIncidents';
import { INCIDENT_QUERY_KEY } from './useIncident';
import { INCIDENT_STATS_QUERY_KEY } from './useIncidentStatistics';

export const useIncidentSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const handleIncidentChange = () => {
      // Invalidate the incident list
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_QUERY_KEY] });
      // Invalidate the stats
      queryClient.invalidateQueries({ queryKey: [INCIDENT_STATS_QUERY_KEY] });
      // Invalidate any individual incident queries
      queryClient.invalidateQueries({ queryKey: [INCIDENT_QUERY_KEY] });
    };

    socket.on('incident_created', handleIncidentChange);
    socket.on('incident_updated', handleIncidentChange);

    return () => {
      socket.off('incident_created', handleIncidentChange);
      socket.off('incident_updated', handleIncidentChange);
    };
  }, [queryClient]);
};
