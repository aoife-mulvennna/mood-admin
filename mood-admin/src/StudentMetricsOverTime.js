import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { variables } from './Variables';
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

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StudentMetricsOverTime = ({ studentId, selectedMetrics, setSelectedMetrics }) => {
    const [chartData, setChartData] = useState({ datasets: [] });
    const [selectedRange, setSelectedRange] = useState('7_days');

    useEffect(() => {
        if (selectedMetrics.length > 0) {
            const metricsQuery = selectedMetrics.join(',');
            fetch(`${variables.API_URL}student-aggregated-data/${studentId}?metrics=${metricsQuery}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Fetched student metrics data:', data);
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

                        const datasets = selectedMetrics.map((metric, index) => {
                            
                            const filteredData = filterDataByRange(
                                Object.keys(processedData).map((date) => ({
                                    x: new Date(date),
                                    y: processedData[date][metric].total / processedData[date][metric].count,
                                })),
                                selectedRange
                            );

                            return {
                                label: metric.charAt(0).toUpperCase() + metric.slice(1),
                                data: filteredData,
                                borderColor: `hsl(${index * 60}, 70%, 50%)`,
                                backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
                                pointRadius: 2,
                                pointHoverRadius: 4,
                                fill: false,
                                tension: 0.4,
                            };
                        });
                        setChartData({ datasets });
                    } else {
                        setChartData({ datasets: [] });
                    }
                })
                .catch((err) => console.error('Error fetching student metrics data:', err));
        } else {
            setChartData({ datasets: [] });
        }
    }, [studentId, selectedMetrics, selectedRange]);

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
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1
                  }
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
                tension: 0.4,
            },
        },
    };

    const handleRangeChange = (e) => {
        setSelectedRange(e.target.value);
    };

    const handleMetricChange = (metric) => {
        setSelectedMetrics((prevMetrics) =>
            prevMetrics.includes(metric)
                ? prevMetrics.filter((m) => m !== metric)
                : [...prevMetrics, metric]
        );
    };

    return (
        <div className="bg-gray-100 p-4 ">
            <div className="flex flex-col justify-center mt-4 space-y-4 justify-between">
                <div className="flex-1 w-full h-64">
                    <Line data={chartData} options={options} className="w-full h-full"/>
                </div>
                <div className="flex justify-center space-x-4">

                    {['mood', 'exercise', 'sleep', 'socialisation', 'productivity'].map((metric) => (
                        <label key={metric} className="flex items-center">
                            <input
                                type="checkbox"
                                value={metric}
                                checked={selectedMetrics.includes(metric)}
                                onChange={() => handleMetricChange(metric)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 capitalize">{metric}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-center space-x-4">
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="7_days"
                            checked={selectedRange === '7_days'}
                            onChange={handleRangeChange}
                        />
                        Last 7 Days
                    </label>
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="1_month"
                            checked={selectedRange === '1_month'}
                            onChange={handleRangeChange}
                        />
                        Last Month
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="1_year"
                            checked={selectedRange === '1_year'}
                            onChange={handleRangeChange}
                        />
                        Last Year
                    </label>
                </div>
            </div>
        </div>
    );
};

export default StudentMetricsOverTime;
