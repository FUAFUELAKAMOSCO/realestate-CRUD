import React from 'react';
import { Paper } from '@mui/material';
import { colors, gradients } from '../themeTokens';

const GlassContainer = ({ children, sx = {}, ...props }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: gradients.panel,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        p: { xs: 2, md: 4 },
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default GlassContainer;
