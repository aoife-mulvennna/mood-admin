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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CourseMetricsGraph = ({ courseName }) => {
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

        fetch(`${variables.API_URL}course-metrics?courseName=${courseName}`, {
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
            setData(data);
            setLoading(false);
        })
        .catch((err) => {
            setError('Error fetching data');
            setLoading(false);
            console.error('Error fetching data:', err);
        });
    }, [courseName]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-gray-600">No data available for {courseName}</div>;
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
                radius: 0
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: data.map(record => record.date),
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{courseName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-100 p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Mood</h4>
                    <div className="h-64">
                        <Line data={chartData('mood')} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Exercise</h4>
                    <div className="h-64">
                        <Line data={chartData('exercise')} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Sleep</h4>
                    <div className="h-64">
                        <Line data={chartData('sleep')} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Socialisation</h4>
                    <div className="h-64">
                        <Line data={chartData('socialisation')} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Productivity</h4>
                    <div className="h-64">
                        <Line data={chartData('productivity')} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseMetricsGraph;
