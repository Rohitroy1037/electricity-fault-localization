// src/features/topology/components/TransformerTable.tsx

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
import TransformIcon from '@mui/icons-material/Transform';
import { TransformerNode } from '../types/topology.types';

interface TransformerTableProps {
  transformers: TransformerNode[];
  isLoading: boolean;
  onSelectTransformer: (transformer: TransformerNode) => void;
}

export const TransformerTable: React.FC<TransformerTableProps> = ({
  transformers,
  isLoading,
  onSelectTransformer,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>DT Code / ID</TableCell>
            <TableCell>Parent Feeder ID</TableCell>
            <TableCell align="right">Capacity (kVA)</TableCell>
            <TableCell align="right">Households Served</TableCell>
            <TableCell align="right">Poles Count</TableCell>
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
                <TableCell align="center"><Skeleton variant="circular" width={28} height={28} sx={{ mx: 'auto' }} /></TableCell>
              </TableRow>
            ))
          ) : transformers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No distribution transformer records found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            transformers.map((transformer) => (
              <TableRow
                key={transformer.id || transformer.dt_id}
                hover
                onClick={() => onSelectTransformer(transformer)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TransformIcon color="info" fontSize="small" />
                  {transformer.dt_id}
                </TableCell>
                <TableCell>{transformer.feeder_id}</TableCell>
                <TableCell align="right">{transformer.capacity_kva || 100} kVA</TableCell>
                <TableCell align="right">{transformer.households_served || 0}</TableCell>
                <TableCell align="right">{transformer.poles?.length || transformer.polesCount || 0}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="info" onClick={() => onSelectTransformer(transformer)}>
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
