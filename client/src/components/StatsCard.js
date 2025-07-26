import React from 'react';
import { Typography, Box } from '@mui/material';

const StatsCard = ({ icon, value, label, color = 'primary' }) => {
  return (
    <Box className="stat-card fade-in">
      <Box className="stat-card-icon" sx={{ color: 'white' }}>
        {icon}
      </Box>
      <Typography className="stat-card-value" variant="h3">
        {value}
      </Typography>
      <Typography className="stat-card-label" variant="body2">
        {label}
      </Typography>
    </Box>
  );
};

export default StatsCard;