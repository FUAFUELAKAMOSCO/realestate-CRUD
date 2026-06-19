import React from 'react';
import { TextField } from '@mui/material';
import { colors } from '../themeTokens';

const InputField = ({ label, sx = {}, mode = 'light', ...props }) => {
  const isLight = mode === 'light';

  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      InputLabelProps={{
        style: { color: isLight ? colors.textMuted : '#9ca3af' },
      }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: isLight ? colors.border : 'rgba(255, 255, 255, 0.12)',
          },
          '&:hover fieldset': {
            borderColor: isLight ? 'rgba(124,77,255,0.35)' : 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary,
          },
          color: isLight ? colors.text : '#f3f4f6',
          background: isLight ? colors.surface : 'transparent',
          borderRadius: 2,
        },
        '& .MuiInputBase-input': { color: isLight ? colors.text : '#f3f4f6' },
        '& .MuiInputBase-input::placeholder': { color: isLight ? colors.textSubtle : '#9ca3af', opacity: 1 },
        ...sx,
      }}
      {...props}
    />
  );
};

export default InputField;
