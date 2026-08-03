// src/features/ai/components/AIIncidentAnalysisCard.tsx

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAIIncidentAnalysis } from '../hooks/useAIIncidentAnalysis';

interface AIIncidentAnalysisCardProps {
  incidentId: string;
}

export const AIIncidentAnalysisCard: React.FC<AIIncidentAnalysisCardProps> = ({
  incidentId,
}) => {
  const { data: analysis, isLoading, isError } = useAIIncidentAnalysis(incidentId);

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            Analyzing Fault Telemetry with PROPEL AI...
          </Typography>
          <LinearProgress color="secondary" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !analysis) return null;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        borderColor: 'secondary.main',
        bgcolor: 'rgba(168, 85, 247, 0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <AutoAwesomeIcon color="secondary" />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            AI Fault Diagnostic Summary
          </Typography>
        </Box>

        <Typography variant="body2" paragraph sx={{ lineHeight: 1.6 }}>
          {analysis.summary}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Probable Root Causes (Confidence Score)
        </Typography>

        <Box display="flex" flexDirection="column" gap={1.5} mb={2}>
          {analysis.probableCauses.map((cause, idx) => (
            <Box key={idx}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {cause.cause}
                </Typography>
                <Chip
                  label={`${Math.round(cause.confidence * 100)}% Match`}
                  size="small"
                  color={cause.confidence > 0.7 ? 'error' : 'warning'}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={cause.confidence * 100}
                color={cause.confidence > 0.7 ? 'error' : 'warning'}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {cause.description}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          AI Recommended Action Steps
        </Typography>

        <List disablePadding>
          {analysis.recommendations.map((rec, idx) => (
            <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleOutlineIcon color="secondary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2">{rec}</Typography>} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
