// src/features/ai/components/AIRestorationCard.tsx

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress, Divider, Stepper, Step, StepLabel, StepContent, Alert } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAIRestoration } from '../hooks/useAIRestoration';

interface AIRestorationCardProps {
  incidentId: string;
}

export const AIRestorationCard: React.FC<AIRestorationCardProps> = ({
  incidentId,
}) => {
  const { data: plan, isLoading, isError } = useAIRestoration(incidentId);

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            Computing Optimal Switching Sequence & Backfeed Plan...
          </Typography>
          <LinearProgress color="secondary" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !plan) return null;

  return (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <BuildIcon color="secondary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Automated Restoration & Backfeed Switching Sequence
            </Typography>
          </Box>

          <Chip
            icon={<AccessTimeIcon />}
            label={`Est. Restoration: ${plan.totalEstimatedRestorationTimeMinutes} mins`}
            color="secondary"
            variant="outlined"
          />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
          Sectionalizing & Isolation Steps
        </Typography>

        <Stepper orientation="vertical">
          {plan.isolationSteps.map((step) => (
            <Step key={step.stepNumber} active={true}>
              <StepLabel>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {step.action} (Target: {step.targetAsset})
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="caption" color="text.secondary" display="block">
                  Duration: ~{step.estimatedTimeMinutes} mins
                </Typography>
                <Alert severity="warning" sx={{ mt: 1, py: 0.5 }}>
                  <Typography variant="caption">
                    <strong>Safety Precaution:</strong> {step.safetyPrecaution}
                  </Typography>
                </Alert>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 2 }} />

        {plan.backfeedOptions.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Tie-Switch Backfeeding Option
            </Typography>
            {plan.backfeedOptions.map((opt, idx) => (
              <Box key={idx} p={1.5} sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Source: {opt.sourceFeederId} (Available Capacity: {opt.availableCapacityMva} MVA)
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  Actions: {opt.switchingActions.join(' → ')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" display="block">
          Recommended Field Dispatch: <strong>{plan.recommendedCrew}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};
