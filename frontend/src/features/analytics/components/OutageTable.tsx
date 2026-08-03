// src/features/analytics/components/OutageTable.tsx

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
  TablePagination,
  Typography,
  Skeleton,
  Card,
  CardHeader,
} from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { OutageItem } from '../types/analytics.types';

interface OutageTableProps {
  outages: OutageItem[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OutageTable: React.FC<OutageTableProps> = ({
  outages,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<PowerOffIcon color="error" />}
        title={<Typography variant="h6">Grid Outage Log</Typography>}
        subheader="Unified Scheduled & Unscheduled Grid Disruption Events"
      />
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title / Event</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Feeder ID</TableCell>
              <TableCell align="right">Duration (mins)</TableCell>
              <TableCell align="right">Affected Consumers</TableCell>
              <TableCell>Start Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from(new Array(5)).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={70} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                  <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                </TableRow>
              ))
            ) : outages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No outage events recorded for selected criteria.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              outages.map((outage) => (
                <TableRow key={outage.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {outage.title}
                    {outage.reason && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {outage.reason}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={outage.type}
                      size="small"
                      color={outage.type === 'SCHEDULED' ? 'info' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{outage.feederId || 'Global'}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {outage.durationMinutes} m
                  </TableCell>
                  <TableCell align="right">
                    {outage.affectedConsumers !== undefined ? outage.affectedConsumers : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(outage.startTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPageSizeChange}
      />
    </Card>
  );
};
