import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { variables } from '../Variables';
import ExportCSVButton from '../ExportCSV';

const ComparisonGraphs = () => {
    const [yearlyMetrics, setYearlyMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log('Token:', token); // Check if the token is correctly retrieved
        if (!token) {
            console.error('No token found!');
        }
        // Fetch yearly metrics data
        fetch(`${variables.API_URL}daily-track/metrics`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch data. Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setYearlyMetrics(data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching metrics data');
                setLoading(false);
                console.error('Error fetching metrics data:', err);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const metrics = ['avg_mood', 'avg_exercise', 'avg_sleep', 'avg_socialisation', 'avg_productivity'];

    const renderGraphForYear = (yearName) => {
        const yearData = yearlyMetrics.filter(metric => metric.academic_year_name === yearName);

        const datasets = metrics.map(metric => ({
            label: metric.replace('avg_', '').toUpperCase(),
            data: yearData.map(data => data[metric]),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1
        }));

        const data = {
            labels: yearData.map(data => new Date(data.daily_record_timestamp).toLocaleDateString()),
            datasets: datasets
        };

        return (
            <div key={yearName}>
                <h3>{yearName}</h3>
                <Line data={data} />
            </div>
        );
    };

    const uniqueYears = [...new Set(yearlyMetrics.map(metric => metric.academic_year_name))];

    return (
        <div className="results">
            <h2>Daily Track Metrics Comparison by Academic Year</h2>
            {uniqueYears.map(yearName => (
                <div key={yearName} className="yearly-graphs">
                    {renderGraphForYear(yearName)}
                </div>
            ))}
            <ExportCSVButton />
        </div>
    );
};

export default ComparisonGraphs;
