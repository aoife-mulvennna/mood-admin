import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DistributionPieChart = ({ data, title }) => {
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-2">{title}</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default DistributionPieChart;
