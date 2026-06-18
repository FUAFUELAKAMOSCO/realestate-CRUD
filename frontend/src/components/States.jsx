import React from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Error as ErrorOutlineIcon, Inbox as InboxIcon } from '@mui/icons-material';

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
      }}
    >
      <CircularProgress size={50} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
      <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
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
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
      }}
    >
      <InboxIcon sx={{ fontSize: 60, color: 'text.secondary', alpha: 0.5, mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
        Empty Results
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '400px' }}>
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
        background: 'rgba(239, 68, 68, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 4,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'error.light', mb: 1 }}>
        Connection Pipeline Error
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: '400px' }}>
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
