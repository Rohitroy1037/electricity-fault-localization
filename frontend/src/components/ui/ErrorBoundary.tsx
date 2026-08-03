// src/components/ui/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI component:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          p={3}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'background.paper',
            }}
          >
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Component Rendering Exception
              </Typography>
              <Typography variant="body2">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </Typography>
            </Alert>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              sx={{ px: 3, py: 1 }}
            >
              Reload View
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
