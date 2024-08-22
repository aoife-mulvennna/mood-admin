import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
// Register the required elements with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TagBarChart = () => {
    const [tagStatistics, setTagStatistics] = useState([]);
}

export default Results;