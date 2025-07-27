
import React from 'react';
import Plot from 'react-plotly.js';
import { Box } from '@mui/material';
import ChartContainer from './ChartContainer';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import GridOnIcon from '@mui/icons-material/GridOn';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

const AdvancedCharts = ({ data, themeMode }) => {
    // Prepare data for advanced visualizations
    const prepareScatterData = () => {
        return data
            .filter(item => item.intensity && item.likelihood && item.relevance)
            .map(item => ({
                x: item.intensity,
                y: item.likelihood,
                z: item.relevance,
                text: `${item.title?.substring(0, 50)}...`,
                sector: item.sector,
                country: item.country,
            }));
    };

    const prepareHeatmapData = () => {
        const sectors = [...new Set(data.map(item => item.sector).filter(Boolean))];
        const regions = [...new Set(data.map(item => item.region).filter(Boolean))];

        const heatmapData = sectors.map(sector =>
            regions.map(region => {
                const items = data.filter(item => item.sector === sector && item.region === region);
                return items.length > 0
                    ? items.reduce((sum, item) => sum + (item.intensity || 0), 0) / items.length
                    : 0;

            })
        );

        return { sectors, regions, data: heatmapData };
    };

    const prepareSectorDistribution = () => {
        const sectorCounts = {};
        data.forEach(item => {
            if (item.sector) {
                sectorCounts[item.sector] = (sectorCounts[item.sector] || 0) + 1;
            }
        });

        return {
            labels: Object.keys(sectorCounts),
            values: Object.values(sectorCounts),
            colors: themeMode === 'dark'
                ? ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#fb7185', '#06d6a0', '#f72585']
                : ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#059669', '#d63384'],
        };
    };

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

    const scatterData = prepareScatterData();
    const heatmapData = prepareHeatmapData();
    const sectorData = prepareSectorDistribution();

    return (
        <Box>
            {/* 3D Scatter Plot */}
            <ChartContainer
                title="Intensity vs Likelihood vs Relevance"
                icon={<ScatterPlotIcon />}
            >
                <Plot
                    data={[
                        {
                            x: scatterData.map(d => d.x),
                            y: scatterData.map(d => d.y),
                            z: scatterData.map(d => d.z),
                            mode: 'markers',
                            type: 'scatter3d',
                            marker: {
                                size: 8,
                                color: scatterData.map(d => d.z),
                                colorscale: themeMode === 'dark'
                                    ? [[0, '#1e293b'], [0.5, '#60a5fa'], [1, '#a78bfa']]
                                    : [[0, '#f8fafc'], [0.5, '#3b82f6'], [1, '#8b5cf6']],
                                showscale: true,
                                colorbar: {
                                    title: 'Relevance',
                                    titlefont: { color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b' },
                                    tickfont: { color: themeMode === 'dark' ? '#94a3b8' : '#64748b' },
                                },
                                line: {
                                    color: themeMode === 'dark' ? '#60a5fa' : '#3b82f6',
                                    width: 1
                                },
                                opacity: 0.8,
                            },
                            text: scatterData.map(d => d.text),
                            hovertemplate: '<b>%{text}</b><br>Intensity: %{x}<br>Likelihood: %{y}<br>Relevance: %{z}<extra></extra>',
                        },
                    ]}
                    layout={getChartLayout('', {
                        height: 500,
                        scene: {
                            xaxis: { title: 'Intensity' },
                            yaxis: { title: 'Likelihood' },
                            zaxis: { title: 'Relevance' },
                            camera: {
                                eye: { x: 1.5, y: 1.5, z: 1.5 }
                            }
                        },
                        margin: { t: 20, r: 20, b: 20, l: 20 },
                    })}
                    config={{
                        displayModeBar: false,
                        responsive: true,
                    }}
                    style={{ width: '100%', height: '500px' }}
                />
            </ChartContainer>

            {/* Heatmap */}
            <ChartContainer
                title="Sector vs Region Intensity Heatmap"
                icon={<GridOnIcon />}
            >
                <Plot
                    data={[
                        {
                            z: heatmapData.data,
                            x: heatmapData.regions,
                            y: heatmapData.sectors,
                            type: 'heatmap',
                            colorscale: themeMode === 'dark'
                                ? [[0, '#1e293b'], [0.5, '#60a5fa'], [1, '#a78bfa']]
                                : [[0, '#f8fafc'], [0.5, '#3b82f6'], [1, '#8b5cf6']],
                            showscale: true,
                            colorbar: {
                                title: 'Avg Intensity',
                                titlefont: { color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b' },
                                tickfont: { color: themeMode === 'dark' ? '#94a3b8' : '#64748b' },
                            },
                            hovertemplate: '<b>Sector:</b> %{y}<br><b>Region:</b> %{x}<br><b>Avg Intensity:</b> %{z:.2f}<extra></extra>',
                        },
                    ]}
                    layout={getChartLayout('', {
                        height: 400,
                        margin: { t: 20, r: 20, b: 80, l: 120 },
                        xaxis: {
                            tickangle: -45,
                            title: 'Region'
                        },
                        yaxis: {
                            title: 'Sector'
                        },
                    })}
                    config={{
                        displayModeBar: false,
                        responsive: true,
                    }}
                    style={{ width: '100%', height: '400px' }}
                />
            </ChartContainer>

            {/* Enhanced Donut Chart */}
            <ChartContainer
                title="Sector Distribution"
                icon={<DonutLargeIcon />}
            >
                <Plot
                    data={[
                        {
                            labels: sectorData.labels,
                            values: sectorData.values,
                            type: 'pie',
                            hole: 0.6,
                            marker: {
                                colors: sectorData.colors,
                                line: {
                                    color: themeMode === 'dark' ? '#1e293b' : '#ffffff',
                                    width: 2
                                }
                            },
                            textinfo: 'labelpercent',
                            textposition: 'outside',
                            textfont: {
                                color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b',
                                size: 12
                            },
                            hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>',
                            pull: sectorData.values.map((_, i) => i === 0 ? 0.1 : 0), // Pull out the largest slice
                        },
                    ]}
                    layout={getChartLayout('', {
                        height: 500,
                        margin: { t: 20, r: 20, b: 20, l: 20 },
                        showlegend: true,
                        legend: {
                            orientation: 'v',
                            x: 1.05,
                            y: 0.5,
                            font: {
                                color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b',
                                size: 11
                            }
                        },
                        annotations: [
                            {
                                text: `Total<br><b>${sectorData.values.reduce((a, b) => a + b, 0)}</b><br>Records`,
                                x: 0.5,
                                y: 0.5,
                                font: {
                                    size: 16,
                                    color: themeMode === 'dark' ? '#f1f5f9' : '#1e293b',
                                    family: 'Inter, sans-serif'
                                },
                                showarrow: false,
                                align: 'center'
                            }
                        ]
                    })}
                    config={{
                        displayModeBar: false,
                        responsive: true,
                    }}
                    style={{ width: '100%', height: '500px' }}
                />
            </ChartContainer>
        </Box>
    );
};

export default AdvancedCharts;
