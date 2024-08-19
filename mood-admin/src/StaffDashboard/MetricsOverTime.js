import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { variables } from '../Variables';
import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register the necessary Chart.js components
ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MetricsOverTime = ({ selectedMetrics }) => {
    const [chartData, setChartData] = useState({ datasets: [] });

    useEffect(() => {
        if (selectedMetrics.length > 0) {
            const metricsQuery = selectedMetrics.join(',');
            fetch(`${variables.API_URL}aggregated-data?metrics=${metricsQuery}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.data) {
                        const processedData = {};

                        // Group data by date and calculate averages
                        data.data.forEach((entry) => {
                            const date = new Date(entry.daily_record_timestamp).toISOString().split('T')[0]; // Extract only the date part
                            if (!processedData[date]) {
                                processedData[date] = {};
                            }

                            selectedMetrics.forEach((metric) => {
                                if (!processedData[date][metric]) {
                                    processedData[date][metric] = { total: 0, count: 0 };
                                }
                                processedData[date][metric].total += entry[`${metric}_score`];
                                processedData[date][metric].count += 1;
                            });
                        });

                        const datasets = selectedMetrics.map((metric, index) => ({
                            label: metric.charAt(0).toUpperCase() + metric.slice(1),
                            data: Object.keys(processedData).map((date) => ({
                                x: new Date(date),
                                y: processedData[date][metric].total / processedData[date][metric].count, // Calculate average
                            })),
                            borderColor: `hsl(${index * 60}, 70%, 50%)`,
                            backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            fill: false,
                        }));
                        setChartData({ datasets });
                    } else {
                        setChartData({ datasets: [] });
                    }
                })
                .catch((err) => console.error('Error fetching aggregated data:', err));
        } else {
            setChartData({ datasets: [] });
        }
    }, [selectedMetrics]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
            },
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default MetricsOverTime;
