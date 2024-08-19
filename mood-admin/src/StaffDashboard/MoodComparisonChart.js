import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { variables } from '../Variables';
import 'chart.js/auto';

const MoodComparisonChart = () => {
    const [chartData, setChartData] = useState({ datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${variables.API_URL}mood-comparison`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();

                // Process the data to structure it for the chart
                const labels = data.map(item => item.month);
                const lastYearData = data.map(item => item.lastYearMood);
                const thisYearData = data.map(item => item.thisYearMood);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Last Year',
                            data: lastYearData,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                        {
                            label: 'This Year',
                            data: thisYearData,
                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching mood comparison data:', error);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Mood Comparison: Last Year vs This Year',
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default MoodComparisonChart;
