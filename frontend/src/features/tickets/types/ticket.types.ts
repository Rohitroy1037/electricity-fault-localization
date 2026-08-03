// src/features/tickets/types/ticket.types.ts

export type TicketStatus =
  | 'DETECTED'
  | 'ACKNOWLEDGED'
  | 'CREW_ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export interface StatusHistoryEntry {
  status: TicketStatus;
  timestamp: string;
  performedBy: string;
  comment?: string;
}

export interface Ticket {
  id: string;
  ticket_no?: string;
  fault_id?: string;
  status: TicketStatus;
  priority: TicketPriority;
  severity?: string;
  assignedOperator?: string;
  assignedCrew?: string;
  assigned_crew?: string;
  crew_notes?: string;
  notes?: string;
  tags?: string[];
  verificationRequired?: boolean;
  verificationStatus?: VerificationStatus;
  verification_notes?: string;
  ticketVersion?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  detected_at?: string;
  acknowledged_at?: string;
  crew_assigned_at?: string;
  resolved_at?: string;
  verified_at?: string;
  closed_at?: string;
  statusHistory?: StatusHistoryEntry[];
}

export interface TicketStatistics {
  total: number;
  detected: number;
  acknowledged: number;
  crewAssigned: number;
  inProgress?: number;
  resolved: number;
  verified: number;
  closed: number;
  byPriority?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byStatus?: Record<string, number>;
  verification?: {
    pending: number;
    verified: number;
    failed: number;
  };
}

export interface TicketQueryParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  verificationStatus?: VerificationStatus | '';
  assignedCrew?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TicketUpdatePayload {
  assignedOperator?: string;
  assignedCrew?: string;
  notes?: string;
  tags?: string[];
  ticketVersion?: number;
}

export interface TicketTransitionPayload {
  newStatus: TicketStatus;
  performedBy?: string;
  comment?: string;
}

export interface PaginatedTicketsResponse {
  data: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
