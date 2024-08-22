import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { variables } from '../Variables';
import './Results.css'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const YearlyMetricsGraph = ({ academicYear }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('Authentication token is missing.');
            setLoading(false);
            return;
        }

        fetch(`${variables.API_URL}yearly-metrics?academicYear=${academicYear}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Yearly metrics data:', data);  
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching data');
                setLoading(false);
                console.error('Error fetching data:', err);
            });
    }, [academicYear]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No data available for {academicYear}</div>;
    }

    const chartData = (metric) => {
        return {
            labels: data.map(record => record.date),
            datasets: [{
                label: metric,
                data: data.map(record => record[metric]),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
                radius: 0,
           
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,  // Prevent chart from being squashed
        plugins: {
            legend: {
                display: false  // Remove the legend
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: data.map(record => record.date),
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
            y: {
                beginAtZero: false,
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1 // Control the step size of the y-axis ticks
                },
            },
        },
    };

    return (
        <div className="mb-10">
            <h3 className="text-l font-semibold text-gray-800 mb-4">{academicYear} Year </h3>
            <div className="grid grid-cols-1 gap-6">
             
                <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Mood</h4>
                    <div className="h-64">
                        <Line data={chartData('mood')} options={chartOptions} />
                    </div>
                </div>
              
                <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Exercise</h4>
                    <div className="h-64">
                        <Line data={chartData('exercise')} options={chartOptions} />
                    </div>
                </div>

                 <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Sleep</h4>
                    <div className="h-64">
                        <Line data={chartData('sleep')} options={chartOptions} />
                    </div>
                </div>
                <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Socialisation</h4>
                <div className="h-64">
                        <Line data={chartData('socialisation')} options={chartOptions} />
                    </div>
                </div>
                <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Productivity</h4>
                    <div className="h-64">
                        <Line data={chartData('productivity')} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default YearlyMetricsGraph;