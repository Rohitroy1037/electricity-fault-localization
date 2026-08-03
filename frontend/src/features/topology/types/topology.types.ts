// src/features/topology/types/topology.types.ts

export type NodeType = 'FEEDER' | 'TRANSFORMER' | 'POLE';

export type PoleStatus = 'ENERGIZED' | 'DE_ENERGIZED' | 'UNKNOWN';

export interface FeederNode {
  id: string;
  feeder_id: string;
  name?: string;
  feeder_name?: string;
  substation_id?: string;
  voltage_kv?: number;
  capacity_mva?: number;
  transformersCount?: number;
  polesCount?: number;
  transformers?: TransformerNode[];
  poles?: PoleNode[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransformerNode {
  id: string;
  dt_id: string;
  feeder_id: string;
  capacity_kva?: number;
  households_served?: number;
  latitude?: number;
  longitude?: number;
  polesCount?: number;
  poles?: PoleNode[];
  feeder_name?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PoleNode {
  id: string;
  pole_id: string;
  feeder_id: string;
  dt_id: string;
  seq_on_line?: number;
  parent_pole_id?: string;
  pole_type?: string;
  ward?: string;
  pincode?: string;
  has_device?: boolean;
  current_status?: PoleStatus;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SelectedNode {
  type: NodeType;
  id: string;
  data?: FeederNode | TransformerNode | PoleNode;
}

export interface TopologyQueryParams {
  search?: string;
  ward?: string;
  status?: PoleStatus | '';
  include?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TopologyMetadata {
  totalFeeders: number;
  totalTransformers: number;
  totalPoles: number;
  instrumentedPoles: number;
}
