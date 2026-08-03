// src/components/ui/LoadingButton.tsx
import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};
