import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading data...' }) => {
  return (
    <Box className="loading-container">
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography className="loading-text" variant="h6">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;