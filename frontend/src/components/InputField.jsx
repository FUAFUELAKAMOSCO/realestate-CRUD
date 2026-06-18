import React from 'react';
import { TextField } from '@mui/material';

const InputField = ({ label, sx = {}, ...props }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      InputLabelProps={{
        style: { color: '#9ca3af' },
      }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
          color: '#f3f4f6',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default InputField;
