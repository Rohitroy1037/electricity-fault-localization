// src/pages/AIAssistant.tsx

import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsycholgyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import { useAIChat } from '../features/ai/hooks/useAIChat';
import { AIChatWindow } from '../features/ai/components/AIChatWindow';

const AIAssistant: React.FC = () => {
  const { messages, sendMessage, clearChat, isPending } = useAIChat();

  return (
    <Box>
      {/* Page Title */}
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <AutoAwesomeIcon color="secondary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Grid Intelligence AI Co-Pilot
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-Assisted Fault Localization, Root Cause Analysis, and Backfeed Switching Sequence
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Chat Interface */}
        <Grid item xs={12} lg={8}>
          <AIChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            isPending={isPending}
          />
        </Grid>

        {/* Side Metrics & Quick Intelligence Capabilities */}
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PsycholgyIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  AI Capabilities
                </Typography>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'rgba(59, 130, 246, 0.04)' }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                  ⚡ Fault Localization
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Calculates short-circuit impedance distance to identify faulted poles on de-energized feeders.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'rgba(168, 85, 247, 0.04)' }}>
                <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 600 }}>
                  🛠️ Backfeed Optimization
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Computes tie-switch sequences to restore power to healthy sub-segments within minutes.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.04)' }}>
                <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                  📊 Reliability Analytics
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monitors IEEE 1366 indices (SAIDI, SAIFI, CAIDI, ASAI) with automated trend forecasting.
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SecurityIcon color="info" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Operator Safety Guards
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" paragraph>
                All AI-generated switching recommendations include safety lockout/tagout verifications prior to breaker operation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIAssistant;
