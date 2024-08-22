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
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);

            const dateArray = [];
            for (let d = new Date(oneMonthAgo); d <= today; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d).toISOString().split('T')[0]);
            }

            const completeData = dateArray.map(date => {
                const record = data.find(r => r.date === date);
                return record || { date, mood: null, exercise: null, sleep: null, socialisation: null, productivity: null };
            });

            setData(completeData);
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

    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    const chartData = (metric) => {
        const labels = data.map(record => record.date);
    
        // Replace today's date with 'Today'
        const updatedLabels = labels.map(label => label === today ? 'Today' : label);
    
            // Check if today's date is already in the labels; if not, add it.
    if (!updatedLabels.includes('Today')) {
        updatedLabels.push('Today');
        // Add a corresponding value (e.g., null) to avoid breaking the data alignment
        data.push({ date: today, [metric]: null });
    }
        return {
            labels: updatedLabels,
            datasets: [{
                label: metric,
                data: data.map(record => record[metric]),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
                radius: 0,
                spanGaps: true  
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
                ticks: {
                    autoSkip: true, // Skip labels
                    maxTicksLimit: 10, // Limit the number of labels shown
                    maxRotation: 45, // Rotate labels 45 degrees
                    minRotation: 45, // Ensure the labels are rotated
                    
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
        spanGaps: true,
    };

    return (
        <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{courseName}</h3>
            <div className="grid grid-cols-1gap-6">
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

export default CourseMetricsGraph;
