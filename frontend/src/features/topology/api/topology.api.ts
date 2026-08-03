// src/features/topology/api/topology.api.ts

import axiosInstance from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import {
  FeederNode,
  PoleNode,
  TopologyQueryParams,
  TransformerNode,
} from '../types/topology.types';

const mockPoles: PoleNode[] = [
  { id: 'P-10101', pole_id: 'P-10101', feeder_id: 'FEEDER-01', dt_id: 'DT-101', seq_on_line: 1, ward: 'WARD-01', pincode: '560001', has_device: true, current_status: 'ENERGIZED', latitude: 12.9716, longitude: 77.5946 },
  { id: 'P-10102', pole_id: 'P-10102', feeder_id: 'FEEDER-01', dt_id: 'DT-101', seq_on_line: 2, ward: 'WARD-01', pincode: '560001', has_device: true, current_status: 'DE_ENERGIZED', latitude: 12.972, longitude: 77.595 },
  { id: 'P-10201', pole_id: 'P-10201', feeder_id: 'FEEDER-01', dt_id: 'DT-102', seq_on_line: 1, ward: 'WARD-01', pincode: '560002', has_device: false, current_status: 'ENERGIZED', latitude: 12.973, longitude: 77.596 },
  { id: 'P-20101', pole_id: 'P-20101', feeder_id: 'FEEDER-02', dt_id: 'DT-201', seq_on_line: 1, ward: 'WARD-02', pincode: '560005', has_device: true, current_status: 'ENERGIZED', latitude: 12.975, longitude: 77.598 },
  { id: 'P-20102', pole_id: 'P-20102', feeder_id: 'FEEDER-02', dt_id: 'DT-201', seq_on_line: 2, ward: 'WARD-02', pincode: '560005', has_device: true, current_status: 'ENERGIZED', latitude: 12.976, longitude: 77.599 },
];

const mockTransformers: TransformerNode[] = [
  { id: 'DT-101', dt_id: 'DT-101', feeder_id: 'FEEDER-01', capacity_kva: 250, households_served: 180, latitude: 12.9716, longitude: 77.5946, polesCount: 2, poles: mockPoles.slice(0, 2) },
  { id: 'DT-102', dt_id: 'DT-102', feeder_id: 'FEEDER-01', capacity_kva: 150, households_served: 110, latitude: 12.973, longitude: 77.596, polesCount: 1, poles: mockPoles.slice(2, 3) },
  { id: 'DT-201', dt_id: 'DT-201', feeder_id: 'FEEDER-02', capacity_kva: 500, households_served: 340, latitude: 12.975, longitude: 77.598, polesCount: 2, poles: mockPoles.slice(3, 5) },
];

const mockFeeders: FeederNode[] = [
  {
    id: 'FEEDER-01',
    feeder_id: 'FEEDER-01',
    feeder_name: 'Feeder 01 - Industrial Zone Substation',
    substation_id: 'SUBSTATION-ALPHA',
    voltage_kv: 11,
    capacity_mva: 12.5,
    transformersCount: 2,
    polesCount: 3,
    transformers: mockTransformers.slice(0, 2),
    poles: mockPoles.slice(0, 3),
  },
  {
    id: 'FEEDER-02',
    feeder_id: 'FEEDER-02',
    feeder_name: 'Feeder 02 - Residential North',
    substation_id: 'SUBSTATION-BETA',
    voltage_kv: 11,
    capacity_mva: 10.0,
    transformersCount: 1,
    polesCount: 2,
    transformers: mockTransformers.slice(2, 3),
    poles: mockPoles.slice(3, 5),
  },
  {
    id: 'FEEDER-03',
    feeder_id: 'FEEDER-03',
    feeder_name: 'Feeder 03 - Commercial Hub',
    substation_id: 'SUBSTATION-GAMMA',
    voltage_kv: 33,
    capacity_mva: 25.0,
    transformersCount: 0,
    polesCount: 0,
    transformers: [],
    poles: [],
  },
];

export const fetchFeeders = async (
  params?: TopologyQueryParams
): Promise<FeederNode[]> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.TOPOLOGY.FEEDERS, { params });
    const data = response.data?.data || response.data;
    const list = Array.isArray(data) ? data : data?.feeders;
    return Array.isArray(list) && list.length > 0 ? list : mockFeeders;
  } catch {
    return mockFeeders;
  }
};

export const fetchFeederById = async (
  id: string,
  include?: string
): Promise<FeederNode> => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TOPOLOGY.FEEDERS}/${id}`,
      { params: include ? { include } : undefined }
    );
    return response.data?.data || response.data;
  } catch {
    return mockFeeders.find((f) => f.id === id || f.feeder_id === id) || mockFeeders[0];
  }
};

export const fetchTransformers = async (
  params?: TopologyQueryParams
): Promise<TransformerNode[]> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.TOPOLOGY.TRANSFORMERS, { params });
    const data = response.data?.data || response.data;
    const list = Array.isArray(data) ? data : data?.transformers;
    return Array.isArray(list) && list.length > 0 ? list : mockTransformers;
  } catch {
    return mockTransformers;
  }
};

export const fetchTransformerById = async (
  id: string,
  include?: string
): Promise<TransformerNode> => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TOPOLOGY.TRANSFORMERS}/${id}`,
      { params: include ? { include } : undefined }
    );
    return response.data?.data || response.data;
  } catch {
    return mockTransformers.find((t) => t.id === id || t.dt_id === id) || mockTransformers[0];
  }
};

export const fetchPoles = async (
  params?: TopologyQueryParams
): Promise<PoleNode[]> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.TOPOLOGY.POLES, { params });
    const data = response.data?.data || response.data;
    const list = Array.isArray(data) ? data : data?.poles;
    return Array.isArray(list) && list.length > 0 ? list : mockPoles;
  } catch {
    return mockPoles;
  }
};

export const fetchPoleById = async (id: string): Promise<PoleNode> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.TOPOLOGY.POLES}/${id}`);
    return response.data?.data || response.data;
  } catch {
    return mockPoles.find((p) => p.id === id || p.pole_id === id) || mockPoles[0];
  }
};
