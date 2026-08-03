// src/features/topology/components/PoleTable.tsx

import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Typography,
  Skeleton,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SensorsIcon from '@mui/icons-material/Sensors';
import { PoleNode } from '../types/topology.types';

interface PoleTableProps {
  poles: PoleNode[];
  isLoading: boolean;
  onSelectPole: (pole: PoleNode) => void;
}

export const PoleTable: React.FC<PoleTableProps> = ({
  poles,
  isLoading,
  onSelectPole,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Pole ID</TableCell>
            <TableCell>DT / Feeder</TableCell>
            <TableCell align="right">Sequence on Line</TableCell>
            <TableCell>Ward / Pincode</TableCell>
            <TableCell>IoT Status</TableCell>
            <TableCell>Energization Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from(new Array(5)).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={70} height={24} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                <TableCell align="center"><Skeleton variant="circular" width={28} height={28} sx={{ mx: 'auto' }} /></TableCell>
              </TableRow>
            ))
          ) : poles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No distribution pole records found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            poles.map((pole) => (
              <TableRow
                key={pole.id || pole.pole_id}
                hover
                onClick={() => onSelectPole(pole)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon
                    fontSize="small"
                    color={pole.current_status === 'DE_ENERGIZED' ? 'error' : 'warning'}
                  />
                  {pole.pole_id}
                </TableCell>
                <TableCell>
                  {pole.dt_id}
                  <Typography variant="caption" color="text.secondary" display="block">
                    {pole.feeder_id}
                  </Typography>
                </TableCell>
                <TableCell align="right">{pole.seq_on_line || 1}</TableCell>
                <TableCell>
                  {pole.ward || 'N/A'}
                  {pole.pincode && ` (${pole.pincode})`}
                </TableCell>
                <TableCell>
                  {pole.has_device ? (
                    <Chip
                      icon={<SensorsIcon fontSize="small" />}
                      label="Instrumented"
                      size="small"
                      color="success"
                      variant="filled"
                    />
                  ) : (
                    <Chip label="Unmonitored" size="small" variant="outlined" color="default" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={pole.current_status || 'ENERGIZED'}
                    size="small"
                    color={pole.current_status === 'DE_ENERGIZED' ? 'error' : 'success'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="warning" onClick={() => onSelectPole(pole)}>
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
