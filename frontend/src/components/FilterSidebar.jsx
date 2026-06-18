import React from 'react';
import {
  Box, Typography, Button, FormControl, InputLabel,
  Select, MenuItem, Stack, TextField,
} from '@mui/material';
import { FilterAltOff as FilterAltOffIcon } from '@mui/icons-material';

const FilterSidebar = ({ filters, onChange, onClear, lightMode = false }) => {
  const labelColor = lightMode ? '#6b7280' : '#9ca3af';
  const inputBg    = lightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)';
  const borderCol  = lightMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)';
  const textColor  = lightMode ? '#111827'           : '#f3f4f6';
  const titleColor = lightMode ? '#111827'           : '#f3f4f6';
  const dividerCol = lightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: inputBg,
      color: textColor,
      '& fieldset': { borderColor: borderCol },
      '&:hover fieldset': { borderColor: lightMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' },
      '&.Mui-focused fieldset': { borderColor: '#7c4dff' },
    },
    '& .MuiInputLabel-root': { color: labelColor },
  };

  const selectSx = {
    borderRadius: 2,
    background: inputBg,
    color: textColor,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: borderCol },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: lightMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c4dff' },
    '& .MuiSelect-icon': { color: labelColor },
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 800,
          color: titleColor,
          mb: 2,
          pb: 1.5,
          borderBottom: `1px solid ${dividerCol}`,
          letterSpacing: '0.04em',
        }}
      >
        Search Filters
      </Typography>

      <Stack spacing={0.5}>
        <TextField
          label="Search"
          name="search"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Title, description..."
          size="small"
          fullWidth
          sx={inputSx}
        />

        <TextField
          label="City"
          name="city"
          value={filters.city}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="e.g. New York"
          size="small"
          fullWidth
          sx={inputSx}
        />

        <TextField
          label="Min Price ($)"
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={(e) => onChange('minPrice', e.target.value)}
          size="small"
          fullWidth
          inputProps={{ min: 0 }}
          sx={inputSx}
        />

        <TextField
          label="Max Price ($)"
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onChange('maxPrice', e.target.value)}
          size="small"
          fullWidth
          inputProps={{ min: 0 }}
          sx={inputSx}
        />

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: labelColor }}>Property Type</InputLabel>
          <Select
            value={filters.propertyType}
            onChange={(e) => onChange('propertyType', e.target.value)}
            label="Property Type"
            sx={selectSx}
            MenuProps={{
              PaperProps: {
                sx: { background: lightMode ? '#fff' : '#1a1b2e', color: textColor },
              },
            }}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Apartment">Apartment</MenuItem>
            <MenuItem value="House">House</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant={lightMode ? 'outlined' : 'outlined'}
          color="primary"
          startIcon={<FilterAltOffIcon />}
          onClick={onClear}
          sx={{ borderRadius: 2, fontWeight: 700, mt: 0.5 }}
        >
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterSidebar;
