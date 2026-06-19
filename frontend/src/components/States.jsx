import React from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Error as ErrorOutlineIcon, Inbox as InboxIcon } from '@mui/icons-material';
import { colors, gradients } from '../themeTokens';

export const LoadingState = ({ message = 'Loading PropSpace...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '250px',
        width: '100%',
        p: 4,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
      }}
    >
      <CircularProgress size={50} thickness={4} sx={{ color: colors.primary, mb: 2 }} />
      <Typography variant="body1" sx={{ color: colors.textMuted, fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export const EmptyState = ({ message = 'No listings found matching your search criteria.' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '250px',
        width: '100%',
        p: 4,
        textAlign: 'center',
        background: gradients.panel,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
      }}
    >
      <InboxIcon sx={{ fontSize: 60, color: colors.textSubtle, opacity: 0.55, mb: 2 }} />
      <Typography variant="h6" sx={{ color: colors.text, mb: 1 }}>
        Empty Results
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textMuted, maxWidth: '400px' }}>
        {message}
      </Typography>
    </Box>
  );
};

export const ErrorState = ({ message = 'A network error occurred while accessing the pipeline.', onRetry }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '250px',
        width: '100%',
        p: 4,
        textAlign: 'center',
        background: colors.surface,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 4,
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'error.main', mb: 1 }}>
        Connection Pipeline Error
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textMuted, mb: 3, maxWidth: '400px' }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry} sx={{ borderRadius: 3 }}>
          Retry Request
        </Button>
      )}
    </Box>
  );
};
