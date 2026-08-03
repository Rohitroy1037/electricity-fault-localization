// src/features/topology/components/FeederTable.tsx

import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Skeleton,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PowerIcon from '@mui/icons-material/Power';
import { FeederNode } from '../types/topology.types';

interface FeederTableProps {
  feeders: FeederNode[];
  isLoading: boolean;
  onSelectFeeder: (feeder: FeederNode) => void;
}

export const FeederTable: React.FC<FeederTableProps> = ({
  feeders,
  isLoading,
  onSelectFeeder,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Feeder Name / ID</TableCell>
            <TableCell>Substation ID</TableCell>
            <TableCell align="right">Voltage (kV)</TableCell>
            <TableCell align="right">Capacity (MVA)</TableCell>
            <TableCell align="right">Transformers</TableCell>
            <TableCell align="right">Poles</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from(new Array(4)).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                <TableCell align="center"><Skeleton variant="circular" width={28} height={28} sx={{ mx: 'auto' }} /></TableCell>
              </TableRow>
            ))
          ) : feeders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No feeder records found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            feeders.map((feeder) => (
              <TableRow
                key={feeder.id || feeder.feeder_id}
                hover
                onClick={() => onSelectFeeder(feeder)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PowerIcon color="primary" fontSize="small" />
                  {feeder.feeder_name || feeder.name || feeder.feeder_id}
                </TableCell>
                <TableCell>{feeder.substation_id || 'SUB-MAIN'}</TableCell>
                <TableCell align="right">{feeder.voltage_kv || 11} kV</TableCell>
                <TableCell align="right">{feeder.capacity_mva || 10} MVA</TableCell>
                <TableCell align="right">{feeder.transformers?.length || feeder.transformersCount || 0}</TableCell>
                <TableCell align="right">{feeder.poles?.length || feeder.polesCount || 0}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary" onClick={() => onSelectFeeder(feeder)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
