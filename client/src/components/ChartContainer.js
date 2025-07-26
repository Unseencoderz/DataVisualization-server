import React from 'react';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DownloadIcon from '@mui/icons-material/Download';

const ChartContainer = ({ 
  title, 
  children, 
  onFullscreen, 
  onDownload,
  icon 
}) => {
  return (
    <Box className="chart-container fade-in">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onFullscreen && (
            <Tooltip title="Fullscreen">
              <IconButton onClick={onFullscreen} size="small">
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDownload && (
            <Tooltip title="Download">
              <IconButton onClick={onDownload} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Box sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: 2,
        '& > *': {
          width: '100% !important',
          maxWidth: '100% !important'
        }
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default ChartContainer;