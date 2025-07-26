import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import {
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
  Switch,
  FormControlLabel,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FilterListIcon from '@mui/icons-material/FilterList';
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

  const [endYear, setEndYear] = useState('');
  const [topic, setTopic] = useState('');
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [pest, setPest] = useState('');
  const [source, setSource] = useState('');
  const [swot, setSwot] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

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
  document.body.className = themeMode; // Add this line
}, [themeMode]);

  useEffect(() => {
    if (isOffline) {
      setOfflineOpen(true);
    }
  }, [isOffline]);

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

  const applyFilters = () => {
    let filtered = data;
    if (endYear) filtered = filtered.filter(item => new Date(item.published).getFullYear() === parseInt(endYear));
    if (topic) filtered = filtered.filter(item => item.topic === topic);
    if (sector) filtered = filtered.filter(item => item.sector === sector);
    if (region) filtered = filtered.filter(item => item.region === region);
    if (pest) filtered = filtered.filter(item => item.pest === pest);
    if (source) filtered = filtered.filter(item => item.source === source);
    if (swot) filtered = filtered.filter(item => item.swot === swot);
    if (country) filtered = filtered.filter(item => item.country === country);
    if (city) filtered = filtered.filter(item => item.city === city);
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [endYear, topic, sector, region, pest, source, swot, country, city]);

  const handleThemeChange = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="dashboard">
          <Typography variant="h1" className="dashboard-title">
            Data Visualization Dashboard
          </Typography>
          <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="dashboard-container">
        <div className="sidebar">
          <Typography variant="h4">Filters</Typography>
          <div className="filter-container">
            <FormControl>
              <InputLabel>End Year</InputLabel>
              <Select value={endYear} onChange={e => setEndYear(e.target.value)}>
                {[...new Set(data.map(item => new Date(item.published).getFullYear()))].map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>Topic</InputLabel>
<Select value={topic} onChange={e => setTopic(e.target.value)}>
{[...new Set(data.map(item => item.topic))].map(topic => (
<MenuItem key={topic} value={topic}>
{topic}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>Sector</InputLabel>
<Select value={sector} onChange={e => setSector(e.target.value)}>
{[...new Set(data.map(item => item.sector))].map(sector => (
<MenuItem key={sector} value={sector}>
{sector}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>Region</InputLabel>
<Select value={region} onChange={e => setRegion(e.target.value)}>
{[...new Set(data.map(item => item.region))].map(region => (
<MenuItem key={region} value={region}>
{region}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>Pest</InputLabel>
<Select value={pest} onChange={e => setPest(e.target.value)}>
{[...new Set(data.map(item => item.pest))].map(pest => (
<MenuItem key={pest} value={pest}>
{pest}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>Source</InputLabel>
<Select value={source} onChange={e => setSource(e.target.value)}>
{[...new Set(data.map(item => item.source))].map(source => (
<MenuItem key={source} value={source}>
{source}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>SWOT</InputLabel>
<Select value={swot} onChange={e => setSwot(e.target.value)}>
{[...new Set(data.map(item => item.swot))].map(swot => (
<MenuItem key={swot} value={swot}>
{swot}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>Country</InputLabel>
<Select value={country} onChange={e => setCountry(e.target.value)}>
{[...new Set(data.map(item => item.country))].map(country => (
<MenuItem key={country} value={country}>
{country}
</MenuItem>
))}
</Select>
</FormControl>
<FormControl>
<InputLabel>City</InputLabel>
<Select value={city} onChange={e => setCity(e.target.value)}>
{[...new Set(data.map(item => item.city))].map(city => (
<MenuItem key={city} value={city}>
{city}
</MenuItem>
))}
</Select>
</FormControl>
</div>
</div>
<div className="main-content">
<div className="navbar">
<Typography variant="h1">Data Visualization Dashboard</Typography>
<div className="theme-switch">
<FormControlLabel
control={<Switch checked={themeMode === 'dark'} onChange={handleThemeChange} />}
label={themeMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
/>
</div>
</div>
<div className="chart-container">
<Typography variant="h2">Intensity by Year (Bar Chart)</Typography>
<Plot
data={[
{
x: years,
y: intensities,
type: 'bar',
marker: { color: 'blue' },
},
]}
layout={{ width: '100%', height: 400, title: 'Intensity by Year' }}
/>
</div>
<div className="chart-container">
<Typography variant="h2">Likelihood by Year (Pie Chart)</Typography>
<Plot
data={[
{
labels: years,
values: likelihoods,
type: 'pie',
hole: 0.4,
},
]}
layout={{ width: '100%', height: 400, title: 'Likelihood by Year' }}
/>
</div>
<div className="chart-container">
<Typography variant="h2">Relevance by Year (Bar Chart)</Typography>
<Plot
data={[
{
x: years,
y: relevances,
type: 'bar',
marker: { color: 'green' },
},
]}
layout={{ width: '100%', height: 400, title: 'Relevance by Year' }}
/>
</div>
</div>
</div>
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


