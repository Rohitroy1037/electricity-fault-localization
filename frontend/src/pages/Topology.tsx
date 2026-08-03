// src/pages/Topology.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Alert } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PowerIcon from '@mui/icons-material/Power';
import TransformIcon from '@mui/icons-material/Transform';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import {
  FeederNode,
  NodeType,
  PoleNode,
  PoleStatus,
  SelectedNode,
  TransformerNode,
} from '../features/topology/types/topology.types';

import { useFeeders } from '../features/topology/hooks/useFeeders';
import { useTransformers } from '../features/topology/hooks/useTransformers';
import { usePoles } from '../features/topology/hooks/usePoles';

import { TopologyMetadataCard } from '../features/topology/components/TopologyMetadataCard';
import { HierarchyBreadcrumb } from '../features/topology/components/HierarchyBreadcrumb';
import { TopologySearch } from '../features/topology/components/TopologySearch';
import { TopologyFilters } from '../features/topology/components/TopologyFilters';
import { TopologyTree } from '../features/topology/components/TopologyTree';
import { FeederTable } from '../features/topology/components/FeederTable';
import { TransformerTable } from '../features/topology/components/TransformerTable';
import { PoleTable } from '../features/topology/components/PoleTable';
import { NodeDetailsDrawer } from '../features/topology/components/NodeDetailsDrawer';
import { TopologySkeleton } from '../features/topology/components/TopologySkeleton';
import { EmptyTopology } from '../features/topology/components/EmptyTopology';

const Topology: React.FC = () => {
  // Navigation & View Tab state (0 = Hierarchy Tree, 1 = Feeders, 2 = Transformers, 3 = Poles)
  const [activeTab, setActiveTab] = useState(0);

  // Filter State
  const [search, setSearch] = useState('');
  const [viewScope, setViewScope] = useState<'ALL' | 'FEEDERS' | 'TRANSFORMERS' | 'POLES'>('ALL');
  const [ward, setWard] = useState('');
  const [status, setStatus] = useState<PoleStatus | ''>('');

  // Selected Node for Specifications Drawer & Breadcrumb
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Query Parameters
  const queryParams = {
    ...(search && { search }),
    ...(ward && { ward }),
    ...(status && { status }),
    include: 'transformers,poles',
  };

  // Queries
  const feedersQuery = useFeeders(queryParams);
  const transformersQuery = useTransformers(queryParams);
  const polesQuery = usePoles(queryParams);

  const isLoading = feedersQuery.isLoading || transformersQuery.isLoading || polesQuery.isLoading;
  const isError = feedersQuery.isError || transformersQuery.isError || polesQuery.isError;

  // Metadata summary counts
  const feedersList = feedersQuery.data || [];
  const transformersList = transformersQuery.data || [];
  const polesList = polesQuery.data || [];

  const metadata = {
    totalFeeders: feedersList.length,
    totalTransformers: transformersList.length || feedersList.reduce((acc, f) => acc + (f.transformers?.length || f.transformersCount || 0), 0),
    totalPoles: polesList.length || feedersList.reduce((acc, f) => acc + (f.poles?.length || f.polesCount || 0), 0),
    instrumentedPoles: polesList.filter((p) => p.has_device).length,
  };

  const handleOpenDrawer = (type: NodeType, node: FeederNode | TransformerNode | PoleNode) => {
    setSelectedNode({ type, id: node.id || (node as any).feeder_id || (node as any).dt_id || (node as any).pole_id, data: node });
    setDrawerOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setViewScope('ALL');
    setWard('');
    setStatus('');
  };

  const hasActiveFilters = !!(search || ward || status || viewScope !== 'ALL');

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Grid Electrical Topology</Typography>
      </Box>

      {/* Hierarchy Breadcrumbs */}
      <HierarchyBreadcrumb
        selectedFeederId={selectedNode?.type === 'FEEDER' ? selectedNode.id : undefined}
        selectedTransformerId={selectedNode?.type === 'TRANSFORMER' ? selectedNode.id : undefined}
        selectedPoleId={selectedNode?.type === 'POLE' ? selectedNode.id : undefined}
        onReset={() => {
          setSelectedNode(null);
          setActiveTab(0);
        }}
      />

      {/* Metadata KPI Summary Cards */}
      <TopologyMetadataCard metadata={metadata} isLoading={isLoading} />

      {/* Toolbar Filter & Search Panel */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="space-between">
          <TopologySearch search={search} onSearchChange={setSearch} />
          <TopologyFilters
            viewScope={viewScope}
            ward={ward}
            status={status}
            onViewScopeChange={(scope) => {
              setViewScope(scope);
              if (scope === 'FEEDERS') setActiveTab(1);
              else if (scope === 'TRANSFORMERS') setActiveTab(2);
              else if (scope === 'POLES') setActiveTab(3);
              else setActiveTab(0);
            }}
            onWardChange={setWard}
            onStatusChange={setStatus}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </Box>
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to fetch topology data from backend server.
        </Alert>
      )}

      {/* View Mode Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab icon={<AccountTreeIcon />} iconPosition="start" label="Hierarchy Tree View" />
          <Tab icon={<PowerIcon />} iconPosition="start" label="Feeders Table" />
          <Tab icon={<TransformIcon />} iconPosition="start" label="Transformers Table" />
          <Tab icon={<LocationOnIcon />} iconPosition="start" label="Poles Table" />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      {isLoading ? (
        <TopologySkeleton />
      ) : activeTab === 0 ? (
        feedersList.length === 0 ? (
          <EmptyTopology hasFiltersActive={hasActiveFilters} onClearFilters={handleClearFilters} />
        ) : (
          <TopologyTree
            feeders={feedersList}
            onSelectNode={handleOpenDrawer}
            selectedNodeId={selectedNode?.id}
          />
        )
      ) : activeTab === 1 ? (
        <FeederTable
          feeders={feedersList}
          isLoading={feedersQuery.isLoading}
          onSelectFeeder={(feeder) => handleOpenDrawer('FEEDER', feeder)}
        />
      ) : activeTab === 2 ? (
        <TransformerTable
          transformers={transformersList}
          isLoading={transformersQuery.isLoading}
          onSelectTransformer={(dt) => handleOpenDrawer('TRANSFORMER', dt)}
        />
      ) : (
        <PoleTable
          poles={polesList}
          isLoading={polesQuery.isLoading}
          onSelectPole={(pole) => handleOpenDrawer('POLE', pole)}
        />
      )}

      {/* Technical Specifications Drawer */}
      <NodeDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        nodeType={selectedNode?.type}
        nodeData={selectedNode?.data}
      />
    </Box>
  );
};

export default Topology;
