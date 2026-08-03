// src/pages/Analytics.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Alert } from '@mui/material';

import { GroupByInterval, OutageType } from '../features/analytics/types/analytics.types';
import { useAnalyticsSummary } from '../features/analytics/hooks/useAnalyticsSummary';
import { useOutages } from '../features/analytics/hooks/useOutages';
import { useTrends } from '../features/analytics/hooks/useTrends';
import { useAvailability } from '../features/analytics/hooks/useAvailability';
import { useMTTR } from '../features/analytics/hooks/useMTTR';

import { AnalyticsKPICards } from '../features/analytics/components/AnalyticsKPICards';
import { AvailabilityCard } from '../features/analytics/components/AvailabilityCard';
import { MTTRCard } from '../features/analytics/components/MTTRCard';
import { TrendChart } from '../features/analytics/components/TrendChart';
import { OutageTable } from '../features/analytics/components/OutageTable';
import { AnalyticsFilters } from '../features/analytics/components/AnalyticsFilters';
import { DateRangePicker } from '../features/analytics/components/DateRangePicker';
import { ExportButton } from '../features/analytics/components/ExportButton';

const Analytics: React.FC = () => {
  // Query Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [feederId, setFeederId] = useState('');
  const [groupBy, setGroupBy] = useState<GroupByInterval>('day');
  const [outageType, setOutageType] = useState<OutageType | ''>('');
  
  // Outage Table Pagination State
  const [page, setPage] = useState(0); // 0-indexed for MUI
  const [pageSize, setPageSize] = useState(10);

  const queryParams = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(feederId && { feederId }),
    groupBy,
  };

  const outageQueryParams = {
    ...queryParams,
    page: page + 1, // 1-indexed for backend API
    pageSize,
    ...(outageType && { type: outageType }),
  };

  // Queries
  const summaryQuery = useAnalyticsSummary(queryParams);
  const availabilityQuery = useAvailability(queryParams);
  const mttrQuery = useMTTR(queryParams);
  const trendsQuery = useTrends(queryParams);
  const outagesQuery = useOutages(outageQueryParams);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setFeederId('');
    setGroupBy('day');
    setOutageType('');
    setPage(0);
  };

  const hasActiveFilters = !!(startDate || endDate || feederId || outageType || groupBy !== 'day');
  const isAnyError =
    summaryQuery.isError ||
    availabilityQuery.isError ||
    mttrQuery.isError ||
    trendsQuery.isError ||
    outagesQuery.isError;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">System Analytics & Performance</Typography>
        <ExportButton />
      </Box>

      {/* Control Panel Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="space-between">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(d) => {
              setStartDate(d);
              setPage(0);
            }}
            onEndDateChange={(d) => {
              setEndDate(d);
              setPage(0);
            }}
          />
          <AnalyticsFilters
            feederId={feederId}
            groupBy={groupBy}
            outageType={outageType}
            onFeederChange={(f) => {
              setFeederId(f);
              setPage(0);
            }}
            onGroupByChange={(g) => {
              setGroupBy(g);
              setPage(0);
            }}
            onOutageTypeChange={(t) => {
              setOutageType(t);
              setPage(0);
            }}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </Box>
      </Paper>

      {isAnyError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load some analytics components. Check server connection.
        </Alert>
      )}

      {/* Top Level Summary KPIs */}
      <AnalyticsKPICards
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
      />

      {/* Reliability & MTTR Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <AvailabilityCard
            data={availabilityQuery.data}
            isLoading={availabilityQuery.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MTTRCard
            data={mttrQuery.data}
            isLoading={mttrQuery.isLoading}
          />
        </Grid>
      </Grid>

      {/* Performance Trend Visualizer */}
      <Box mb={3}>
        <TrendChart
          trends={trendsQuery.data?.trends}
          isLoading={trendsQuery.isLoading}
          groupBy={groupBy}
        />
      </Box>

      {/* Outage Log Table */}
      <Box mb={3}>
        <OutageTable
          outages={outagesQuery.data?.data || []}
          total={outagesQuery.data?.total || 0}
          page={page}
          pageSize={pageSize}
          isLoading={outagesQuery.isLoading}
          onPageChange={(_, newPage) => setPage(newPage)}
          onPageSizeChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </Box>
  );
};

export default Analytics;
