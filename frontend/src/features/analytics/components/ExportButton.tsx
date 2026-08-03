// src/features/analytics/components/ExportButton.tsx

import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const ExportButton: React.FC = () => {
  const handleExport = () => {
    alert('Exporting analytics report as CSV/PDF...');
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      size="small"
    >
      Export Report
    </Button>
  );
};
