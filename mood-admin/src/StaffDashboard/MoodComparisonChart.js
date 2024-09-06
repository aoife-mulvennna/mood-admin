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

                const currentYear = new Date().getFullYear();
                const lastYear = currentYear - 1;
                // Process the data to structure it for the chart

                const labels = data.map(item => item.month);
                const lastYearData = data.map(item => item.lastYearMood);
                const thisYearData = data.map(item => item.thisYearMood);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${lastYear}`,
                            data: lastYearData,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                        {
                            label: `${currentYear}`,
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
            },
        },
        scales:{
            x:{
                ticks: {
                    stepSize: 1, // Set the step size to 1 day
                },
            }
        
        },
    };

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    return (
      
    <div className="w-full" style={{ height: '500px' }}>
    <h5 className="text-lg font-semibold theme-primary-text flex items-center border-b theme-border pb-2 justify-center"> Comparison of Mood Averages {lastYear} vs {currentYear}
    </h5>
    <Bar data={chartData} options={options} />
    </div>
    )
};

export default MoodComparisonChart;
