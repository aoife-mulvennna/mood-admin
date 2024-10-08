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

const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
};

const MetricsOverTime = ({ selectedMetrics, selectedRange }) => {
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

                        const datasets = selectedMetrics.flatMap((metric, index) => {
                            const filteredData = filterDataByRange(
                                Object.keys(processedData).map((date) => ({
                                    x: new Date(date),
                                    y: processedData[date][metric].total / processedData[date][metric].count,
                                })),
                                selectedRange
                            );

                            const average = filteredData.reduce((sum, dataPoint) => sum + dataPoint.y, 0) / filteredData.length;

                            return [
                                {
                                    label: metric.charAt(0).toUpperCase() + metric.slice(1),
                                    data: filteredData,
                                    borderColor: `hsl(${index * 60}, 70%, 50%)`,
                                    backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
                                    pointRadius: 3, // Increase the point radius for better visibility
                                    pointHoverRadius: 6, // Increase hover effect
                                    fill: false,
                                    tension: 0.4, // Smooth the line curves
                                    
                                },
                                {
                                    label: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Average`,
                                    data: filteredData.map((dataPoint) => ({
                                        x: dataPoint.x,
                                        y: average,
                                    })),
                                    borderColor: `hsl(${index * 60}, 70%, 50%)`,
                                    borderDash: [5, 5],
                                    pointRadius: 0,
                                    pointHoverRadius: 0,
                                    fill: false,
                                  
                                },
                            ];
                        });
                        setChartData({ datasets });
                    } else {
                        setChartData({ datasets: [] });
                    }
                })
                .catch((err) => console.error('Error fetching aggregated data:', err));
        } else {
            setChartData({ datasets: [] });
        }
    }, [selectedMetrics, selectedRange]);

    const filterDataByRange = (data, range) => {
        const now = new Date();
        let startDate;

        if (range === '7_days') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === '1_month') {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (range === '1_year') {
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
        } else {
            startDate = new Date(0); // Default to all time if range is not recognized
        }

        return data.filter(record => new Date(record.x) >= startDate);
    };

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
                beginAtZero: false,
                min: 1, // Set minimum value for Y-axis
                max: 5, // Set maximum value for Y-axis
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                },
            },
            title: {
                display: false,
                text: 'Metrics Over Time',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        elements: {
            line: {
                tension: 0.4, // Smoothing of line curves
            },
        },
    };

    return (
        <div className="w-full" style={{ height: '400px' }}>
            <h5 className="text-lg font-semibold theme-primary-text flex items-center border-b theme-border pb-2 justify-center">Wellness Trends Averaged for All Students</h5>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default MetricsOverTime;
