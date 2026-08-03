export interface KpiMetrics {
  activeIncidents: number;
  openTickets: number;
  criticalIncidents: number;
  healthyFeeders: number;
  affectedFeeders: number;
  offlineDevices: number;
  onlineDevices: number;
  activeFaults: number;
}

export interface RecentEvent {
  id: string;
  type: 'incident' | 'ticket';
  title: string;
  status: string;
  timestamp: string;
}

export interface SystemHealthData {
  score: number;
  status: 'healthy' | 'degraded' | 'critical';
}

export interface FeederStatusData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'faulted';
  load: number;
}

export interface DashboardSummary {
  kpis: KpiMetrics;
  recentEvents: RecentEvent[];
  systemHealth: SystemHealthData;
  feederStatus: FeederStatusData[];
}
