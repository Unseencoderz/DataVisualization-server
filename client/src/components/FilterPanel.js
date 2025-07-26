import React from 'react';
import {
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const FilterPanel = ({ 
  data, 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const filterConfigs = [
    { key: 'endYear', label: 'End Year', field: 'published', transform: (item) => new Date(item.published).getFullYear() },
    { key: 'topic', label: 'Topic', field: 'topic' },
    { key: 'sector', label: 'Sector', field: 'sector' },
    { key: 'region', label: 'Region', field: 'region' },
    { key: 'pest', label: 'PEST', field: 'pest' },
    { key: 'source', label: 'Source', field: 'source' },
    { key: 'swot', label: 'SWOT', field: 'swot' },
    { key: 'country', label: 'Country', field: 'country' },
    { key: 'city', label: 'City', field: 'city' },
  ];

  const getUniqueValues = (field, transform) => {
    const values = data.map(item => transform ? transform(item) : item[field])
      .filter(value => value && value !== '' && value !== null);
    return [...new Set(values)].sort();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  return (
    <Box className="sidebar slide-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          Filters
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={getActiveFiltersCount()} 
              size="small" 
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Tooltip title="Clear all filters">
            <IconButton onClick={onClearFilters} size="small">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      <Box className="filter-container">
        {filterConfigs.map(({ key, label, field, transform }) => (
          <FormControl key={key} fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
              value={filters[key] || ''}
              onChange={(e) => onFilterChange(key, e.target.value)}
              label={label}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiSelect-select': {
                  color: 'text.primary',
                },
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {getUniqueValues(field, transform).map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
    </Box>
  );
};

export default FilterPanel;