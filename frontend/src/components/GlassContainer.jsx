import React from 'react';
import { Paper } from '@mui/material';

const GlassContainer = ({ children, sx = {}, ...props }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'rgba(20, 22, 35, 0.45)', // Translucent dark slate
        backdropFilter: 'blur(14px) saturate(180%)',
        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 4,
        p: { xs: 2, md: 4 },
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
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
