import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Typography,
  Skeleton
} from '@mui/material';
import { FeederStatusData } from '../types/dashboard.types';

interface FeederStatusProps {
  feeders?: FeederStatusData[];
  isLoading?: boolean;
}

export const FeederStatus: React.FC<FeederStatusProps> = ({ feeders = [], isLoading = false }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Feeder Status" />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Load (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(4)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="40%" sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : feeders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No feeder data available.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                feeders.map((feeder) => (
                  <TableRow key={feeder.id} hover>
                    <TableCell>{feeder.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={feeder.status} 
                        size="small"
                        color={
                          feeder.status === 'online' ? 'success' : 
                          feeder.status === 'offline' ? 'default' : 
                          'error'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">{feeder.load}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
