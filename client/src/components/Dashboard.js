import React, { useState, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';
import {
  Snackbar,
  Alert,
  Typography,
  Switch,
  FormControlLabel,
  CssBaseline,
  useMediaQuery,
  Box,
  Fab,
  Zoom,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import TimelineIcon from '@mui/icons-material/Timeline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Import new components
import StatsCard from './StatsCard';
import LoadingSpinner from './LoadingSpinner';
import FilterPanel from './FilterPanel';
import ChartContainer from './ChartContainer';
import DataTable from './DataTable';
import AdvancedCharts from './AdvancedCharts';

import '../styles/Dashboard.css';

const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return isOffline;
};

const Dashboard = () => {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeMode, setThemeMode] = useState(systemPrefersDark ? 'dark' : 'light');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isOffline = useNetworkStatus();
  const [offlineOpen, setOfflineOpen] = useState(isOffline);
  const [slowConnection, setSlowConnection] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Consolidated filters state
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    pest: '',
    source: '',
    swot: '',
    country: '',
    city: '',
  });

  const fetchData = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch('https://datavisualization-server.onrender.com/api/data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const duration = Date.now() - startTime;
      if (duration > 3000) {
        setSlowConnection(true);
      } else {
        setSlowConnection(false);
      }
      setData(result);
      setFilteredData(result);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    document.body.className = themeMode;
  }, [themeMode]);

  useEffect(() => {
    if (isOffline) {
      setOfflineOpen(true);
    }
  }, [isOffline]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOfflineOpen(false);
  };

  const transformDataForCharts = (data) => {
    const years = data.map(item => new Date(item.published).getFullYear());
    const intensities = data.map(item => item.intensity);
    const likelihoods = data.map(item => item.likelihood);
    const relevances = data.map(item => item.relevance);

    return { years, intensities, likelihoods, relevances };
  };

  const { years, intensities, likelihoods, relevances } = transformDataForCharts(filteredData);

  const applyFilters = useCallback(() => {
    let filtered = data;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'endYear') {
          filtered = filtered.filter(item => new Date(item.published).getFullYear() === parseInt(value));
        } else {
          filtered = filtered.filter(item => item[key] === value);
        }
      }
    });

    setFilteredData(filtered);
  }, [data, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      endYear: '',
      topic: '',
      sector: '',
      region: '',
      pest: '',
      source: '',
      swot: '',
      country: '',
      city: '',
    });
  };

  const handleThemeChange = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === 'dark' ? '#60a5fa' : '#3b82f6',
      },
      secondary: {
        main: themeMode === 'dark' ? '#a78bfa' : '#8b5cf6',
      },
      background: {
        default: themeMode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: themeMode === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      },
      text: {
        primary: themeMode === 'dark' ? '#f1f5f9' : '#1e293b',
        secondary: themeMode === 'dark' ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backdropFilter: 'blur(16px)',
          },
        },
      },
    },
  });

  // Calculate statistics
  const getStatistics = () => {
    const totalRecords = filteredData.length;

    const avgIntensity = filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + (item.intensity || 0), 0) / filteredData.length).toFixed(1)
      : 0;

    const avgLikelihood = filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + (item.likelihood || 0), 0) / filteredData.length).toFixed(1)
      : 0;

    const avgRelevance = filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + (item.relevance || 0), 0) / filteredData.length).toFixed(1)
      : 0;

    return { totalRecords, avgIntensity, avgLikelihood, avgRelevance };
  };

  const statistics = getStatistics();

  // Chart configurations with dark theme support
  const getChartLayout = (title, additionalConfig = {}) => ({
    title: {
      text: title,
      font: {
        color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b',
        size: 16,
        family: 'Inter, sans-serif'
      }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b',
      family: 'Inter, sans-serif'
    },
    xaxis: {
      gridcolor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      color: themeMode === 'dark' ? '#94a3b8' : '#64748b',
    },
    yaxis: {
      gridcolor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      color: themeMode === 'dark' ? '#94a3b8' : '#64748b',
    },
    ...additionalConfig
  });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner message="Loading Dashboard..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="dashboard-container">
        <FilterPanel
          data={data}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="main-content">
          {/* Modern Navbar */}
          <div className="navbar">
            <Typography variant="h1">
              Data Visualization Dashboard
            </Typography>
            <div className="theme-switch">
              <FormControlLabel
                control={
                  <Switch
                    checked={themeMode === 'dark'}
                    onChange={handleThemeChange}
                    color="primary"
                  />
                }
                label={themeMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <Box className="stats-grid">
            <StatsCard
              icon={<DataUsageIcon />}
              value={statistics.totalRecords}
              label="Total Records"
            />
            <StatsCard
              icon={<TrendingUpIcon />}
              value={statistics.avgIntensity}
              label="Avg Intensity"
            />
            <StatsCard
              icon={<AssessmentIcon />}
              value={statistics.avgLikelihood}
              label="Avg Likelihood"
            />
            <StatsCard
              icon={<TimelineIcon />}
              value={statistics.avgRelevance}
              label="Avg Relevance"
            />
          </Box>

          {/* Charts */}
          <ChartContainer
            title="Intensity by Year"
            icon={<BarChartIcon />}
          >
            <Plot
              data={[
                {
                  x: years,
                  y: intensities,
                  type: 'bar',
                  marker: {
                    color: themeMode === 'dark' ? '#60a5fa' : '#3b82f6',
                    line: {
                      color: themeMode === 'dark' ? '#3b82f6' : '#1e40af',
                      width: 1
                    }
                  },
                  hovertemplate: '<b>Year:</b> %{x}<br><b>Intensity:</b> %{y}<extra></extra>',
                },
              ]}
              layout={getChartLayout('', {
                height: 400,
                margin: { t: 20, r: 20, b: 40, l: 40 },
              })}
              config={{
                displayModeBar: false,
                responsive: true,
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </ChartContainer>

          <ChartContainer
            title="Likelihood Distribution"
            icon={<PieChartIcon />}
          >
            <Plot
              data={[
                {
                  labels: years,
                  values: likelihoods,
                  type: 'pie',
                  hole: 0.4,
                  marker: {
                    colors: themeMode === 'dark'
                      ? ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#fb7185']
                      : ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
                  },
                  hovertemplate: '<b>Year:</b> %{label}<br><b>Likelihood:</b> %{value}<br><b>Percentage:</b> %{percent}<extra></extra>',
                },
              ]}
              layout={getChartLayout('', {
                height: 400,
                margin: { t: 20, r: 20, b: 20, l: 20 },
                showlegend: true,
                legend: {
                  orientation: 'h',
                  y: -0.1,
                  x: 0.5,
                  xanchor: 'center'
                }
              })}
              config={{
                displayModeBar: false,
                responsive: true,
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </ChartContainer>

          <ChartContainer
            title="Relevance Trends"
            icon={<TimelineIcon />}
          >
            <Plot
              data={[
                {
                  x: years,
                  y: relevances,
                  type: 'scatter',
                  mode: 'linesmarkers',
                  marker: {
                    color: themeMode === 'dark' ? '#34d399' : '#10b981',
                    size: 8,
                    line: {
                      color: themeMode === 'dark' ? '#059669' : '#047857',
                      width: 2
                    }
                  },
                  line: {
                    color: themeMode === 'dark' ? '#34d399' : '#10b981',
                    width: 3
                  },
                  hovertemplate: '<b>Year:</b> %{x}<br><b>Relevance:</b> %{y}<extra></extra>',
                },
              ]}
              layout={getChartLayout('', {
                height: 400,
                margin: { t: 20, r: 20, b: 40, l: 40 },
              })}
              config={{
                displayModeBar: false,
                responsive: true,
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </ChartContainer>

          {/* Advanced Charts */}
          <AdvancedCharts
            data={filteredData}
            themeMode={themeMode}
          />

          {/* Data Table */}
          <DataTable
            data={filteredData}
            title="Detailed Data View"
          />
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.9)',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Notifications */}
      {error && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">Error fetching data. Please try again later.</Alert>
        </Snackbar>
      )}

      <Snackbar open={offlineOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning">
          You are offline. Some features may not be available.
        </Alert>
      </Snackbar>

      {slowConnection && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="info">Your connection is slow. Data may take longer to load.</Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};

export default Dashboard;


