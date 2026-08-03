// src/features/topology/components/TopologyTree.tsx

import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PowerIcon from '@mui/icons-material/Power';
import TransformIcon from '@mui/icons-material/Transform';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SensorsIcon from '@mui/icons-material/Sensors';
import { FeederNode, NodeType, PoleNode, TransformerNode } from '../types/topology.types';

interface TopologyTreeProps {
  feeders: FeederNode[];
  onSelectNode: (type: NodeType, node: FeederNode | TransformerNode | PoleNode) => void;
  selectedNodeId?: string;
}

export const TopologyTree: React.FC<TopologyTreeProps> = ({
  feeders,
  onSelectNode,
  selectedNodeId,
}) => {
  const [expandedFeeders, setExpandedFeeders] = useState<Record<string, boolean>>({});
  const [expandedTransformers, setExpandedTransformers] = useState<Record<string, boolean>>({});

  const toggleFeeder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFeeders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTransformer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTransformers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!feeders || feeders.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No feeders or grid topology data found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <List component="nav" disablePadding>
        {feeders.map((feeder) => {
          const isFeederOpen = !!expandedFeeders[feeder.id || feeder.feeder_id];
          const isFeederSelected = selectedNodeId === (feeder.id || feeder.feeder_id);

          return (
            <React.Fragment key={feeder.id || feeder.feeder_id}>
              {/* Level 1: Feeder */}
              <ListItemButton
                selected={isFeederSelected}
                onClick={() => onSelectNode('FEEDER', feeder)}
                sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  mr={1}
                  onClick={(e) => toggleFeeder(feeder.id || feeder.feeder_id, e)}
                  sx={{ cursor: 'pointer' }}
                >
                  {isFeederOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PowerIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {feeder.feeder_name || feeder.name || feeder.feeder_id}
                    </Typography>
                  }
                  secondary={`Substation: ${feeder.substation_id || 'N/A'} • Voltage: ${feeder.voltage_kv || 11} kV`}
                />
                <Box display="flex" gap={1}>
                  <Chip
                    label={`${feeder.transformers?.length || feeder.transformersCount || 0} DTs`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label={`${feeder.poles?.length || feeder.polesCount || 0} Poles`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </Box>
              </ListItemButton>

              {/* Level 2: Transformers */}
              <Collapse in={isFeederOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {(!feeder.transformers || feeder.transformers.length === 0) ? (
                    <Box p={2}>
                      <Typography variant="body2" color="text.secondary">
                        No transformers linked to this feeder.
                      </Typography>
                    </Box>
                  ) : (
                    feeder.transformers.map((transformer) => {
                      const isDtOpen = !!expandedTransformers[transformer.id || transformer.dt_id];
                      const isDtSelected = selectedNodeId === (transformer.id || transformer.dt_id);

                      return (
                        <React.Fragment key={transformer.id || transformer.dt_id}>
                          <ListItemButton
                            selected={isDtSelected}
                            onClick={() => onSelectNode('TRANSFORMER', transformer)}
                            sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1 }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              mr={1}
                              onClick={(e) => toggleTransformer(transformer.id || transformer.dt_id, e)}
                              sx={{ cursor: 'pointer' }}
                            >
                              {isDtOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                            </Box>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <TransformIcon color="info" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  DT: {transformer.dt_id}
                                </Typography>
                              }
                              secondary={`Capacity: ${transformer.capacity_kva || 100} kVA • Households: ${transformer.households_served || 0}`}
                            />
                            <Chip
                              label={`${transformer.poles?.length || transformer.polesCount || 0} Poles`}
                              size="small"
                              variant="outlined"
                            />
                          </ListItemButton>

                          {/* Level 3: Poles */}
                          <Collapse in={isDtOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                              {(!transformer.poles || transformer.poles.length === 0) ? (
                                <Box p={1.5}>
                                  <Typography variant="caption" color="text.secondary">
                                    No downstream poles.
                                  </Typography>
                                </Box>
                              ) : (
                                transformer.poles.map((pole) => {
                                  const isPoleSelected = selectedNodeId === (pole.id || pole.pole_id);

                                  return (
                                    <ListItemButton
                                      key={pole.id || pole.pole_id}
                                      selected={isPoleSelected}
                                      onClick={() => onSelectNode('POLE', pole)}
                                      sx={{ py: 0.75, borderBottom: '1px solid', borderColor: 'action.hover' }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 28 }}>
                                        <LocationOnIcon
                                          fontSize="small"
                                          color={pole.current_status === 'DE_ENERGIZED' ? 'error' : 'warning'}
                                        />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                            Pole {pole.pole_id} (Seq: {pole.seq_on_line || 1})
                                          </Typography>
                                        }
                                        secondary={`Ward: ${pole.ward || 'N/A'} • Pincode: ${pole.pincode || 'N/A'}`}
                                      />
                                      {pole.has_device && (
                                        <Chip
                                          icon={<SensorsIcon fontSize="small" />}
                                          label="IoT Device"
                                          size="small"
                                          color="success"
                                          variant="filled"
                                          sx={{ height: 20, fontSize: '0.65rem' }}
                                        />
                                      )}
                                    </ListItemButton>
                                  );
                                })
                              )}
                            </List>
                          </Collapse>
                        </React.Fragment>
                      );
                    })
                  )}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};
