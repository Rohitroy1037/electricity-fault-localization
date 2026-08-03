// src/features/topology/components/NodeDetailsDrawer.tsx

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
  Paper,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PowerIcon from '@mui/icons-material/Power';
import TransformIcon from '@mui/icons-material/Transform';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SensorsIcon from '@mui/icons-material/Sensors';
import { FeederNode, NodeType, PoleNode, TransformerNode } from '../types/topology.types';

interface NodeDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  nodeType?: NodeType;
  nodeData?: FeederNode | TransformerNode | PoleNode;
}

export const NodeDetailsDrawer: React.FC<NodeDetailsDrawerProps> = ({
  open,
  onClose,
  nodeType,
  nodeData,
}) => {
  if (!nodeData) return null;

  const renderIcon = () => {
    switch (nodeType) {
      case 'FEEDER':
        return <PowerIcon color="primary" fontSize="large" />;
      case 'TRANSFORMER':
        return <TransformIcon color="info" fontSize="large" />;
      case 'POLE':
        return <LocationOnIcon color="warning" fontSize="large" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    if (nodeType === 'FEEDER') {
      const feeder = nodeData as FeederNode;
      return feeder.feeder_name || feeder.name || feeder.feeder_id;
    }
    if (nodeType === 'TRANSFORMER') {
      const dt = nodeData as TransformerNode;
      return `Transformer DT: ${dt.dt_id}`;
    }
    if (nodeType === 'POLE') {
      const pole = nodeData as PoleNode;
      return `Pole ID: ${pole.pole_id}`;
    }
    return 'Node Specifications';
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 440 }, p: 3, height: '100%', overflowY: 'auto' }}>
        {/* Drawer Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            {renderIcon()}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getTitle()}
              </Typography>
              <Chip label={nodeType} size="small" color="primary" variant="outlined" />
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Specifications Content based on NodeType */}
        {nodeType === 'FEEDER' && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Feeder Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Feeder ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as FeederNode).feeder_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Substation ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as FeederNode).substation_id || 'SUB-MAIN'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nominal Voltage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as FeederNode).voltage_kv || 11} kV</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Rated Capacity</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as FeederNode).capacity_mva || 10} MVA</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Downstream Assets
              </Typography>
              <Box display="flex" justify-content="space-around" pt={1}>
                <Box textAlign="center">
                  <Typography variant="h5" color="info.main" sx={{ fontWeight: 600 }}>
                    {(nodeData as FeederNode).transformers?.length || (nodeData as FeederNode).transformersCount || 0}
                  </Typography>
                  <Typography variant="caption">Transformers</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" color="warning.main" sx={{ fontWeight: 600 }}>
                    {(nodeData as FeederNode).poles?.length || (nodeData as FeederNode).polesCount || 0}
                  </Typography>
                  <Typography variant="caption">Poles</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {nodeType === 'TRANSFORMER' && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Transformer Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">DT Code</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as TransformerNode).dt_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parent Feeder</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as TransformerNode).feeder_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">KVA Rating</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as TransformerNode).capacity_kva || 100} kVA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Consumers / Households</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as TransformerNode).households_served || 0}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                GPS Coordinates
              </Typography>
              <Typography variant="body2">
                Latitude: {(nodeData as TransformerNode).latitude ?? '12.9716'} • Longitude: {(nodeData as TransformerNode).longitude ?? '77.5946'}
              </Typography>
            </Paper>
          </Box>
        )}

        {nodeType === 'POLE' && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pole & Sensor Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pole ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as PoleNode).pole_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Sequence #</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as PoleNode).seq_on_line || 1}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parent DT</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as PoleNode).dt_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Parent Feeder</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as PoleNode).feeder_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Ward Zone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as PoleNode).ward || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pincode</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(nodeData as PoleNode).pincode || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Instrument & Status
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">IoT Sensor:</Typography>
                {(nodeData as PoleNode).has_device ? (
                  <Chip icon={<SensorsIcon />} label="Installed" color="success" size="small" />
                ) : (
                  <Chip label="None" variant="outlined" size="small" />
                )}
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Typography variant="body2">Status:</Typography>
                <Chip
                  label={(nodeData as PoleNode).current_status || 'ENERGIZED'}
                  color={(nodeData as PoleNode).current_status === 'DE_ENERGIZED' ? 'error' : 'success'}
                  size="small"
                />
              </Box>
            </Paper>
          </Box>
        )}

        <Box mt={4}>
          <Button fullWidth variant="contained" onClick={onClose}>
            Close Specifications
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
