import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';
import ExportCSVButton from '../ExportCSV';
import YearlyMetricsGraph from './YearlyMetricsGraph';
import CourseMetricsGraph from './CourseMetricsGraph';
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


const Results = () => {
    const [yearAverages, setYearAverages] = useState([]);
    const [courseAverages, setCourseAverages] = useState([]);
    const [tagStatistics, setTagStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [academicYears, setAcademicYears] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log('Token:', token); // Check if the token is correctly retrieved
        if (!token) {
            console.error('No token found!');
            setError('Authentication token is missing.');
            setLoading(false);
            return;
        }
        // Fetch year and course averages
        fetch(`${variables.API_URL}weekly-averages`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                return res.json();
            })
            .then((data) => {
                setYearAverages(data.yearAverages || []);
                setCourseAverages(data.courseAverages || []);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching averages');
                setLoading(false);
                console.error('Error fetching averages:', err);
            });

        // Fetch relevant tag statistics
        fetchTagStatistics(token);
        // Fetch academic years
        fetch(`${variables.API_URL}course-years`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAcademicYears(data);
            })
            .catch((err) => {
                console.error('Error fetching academic years:', err);
            });
        // Fetch courses
        fetch(`${variables.API_URL}course-names`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCourses(data); // Set the course list in state
            })
            .catch((err) => {
                console.error('Error fetching courses:', err);
            });

    }, []);

    const fetchTagStatistics = () => {
        fetch(`${variables.API_URL}tag-statistics`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch tag statistics');
                }
                return res.json();
            })
            .then((data) => {
                setTagStatistics(data.tagStatistics || []);
            })
            .catch((err) => {
                console.error('Error fetching tag statistics:', err);
            });
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
    }

    const formatNumber = (num) => {
        const parsedNum = parseFloat(num);
        return !isNaN(parsedNum) ? parsedNum.toFixed(1) : 'N/A';
    };

    const formatTagText = (tagName) => {
        if (!tagName) {
            return '';
        }

        // Convert tag name to lowercase and capitalize each word
        const formattedTag = tagName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Custom handling for specific tags
        switch (formattedTag.toLowerCase()) {
            case 'stressed':
                return 'have reported feeling stressed';
            case 'financial worry':
                return 'have experienced financial worry';
            case 'academic worry':
                return 'have experienced academic worry';
            case 'relationship issues':
                return 'have experienced relationship issues';
            case 'family issues':
                return 'have experienced family issues';
            case 'lonely':
                return 'have reported feeling lonely';
            case 'grieving':
                return 'have experienced grief';
            case 'anxious':
                return 'have reported feeling anxious';
            default:
                return `have experienced ${formattedTag.toLowerCase()}`;
        }
    };

    const tagChartData = {
        labels: tagStatistics.map(tag => tag.tagName),
        datasets: [
            {
                label: 'Percentage of Students',
                data: tagStatistics.map(tag => tag.percentage),
                backgroundColor: tagStatistics.map((_, index) =>
                    `rgba(${75 + index * 20}, ${192 - index * 10}, 192, 0.8)`
                ), // Create a gradient effect
                borderColor: tagStatistics.map((_, index) =>
                    `rgba(${75 + index * 20}, ${192 - index * 10}, 192, 1)`
                ),
                borderWidth: 2,
                maxBarThickness: 20, // Limits maximum bar thickness
                barPercentage: 0.9, // Decrease bar width within the category to reduce gaps
                categoryPercentage: 0.9, // Adjust the category width to control overall bar spacing
            },
        ],
    };

    const tagChartOptions = {
        indexAxis: 'y', // makes the bars horizontal
        scales: {
            x: {
                beginAtZero: true,
                display: false, // Hide x-axis
                grid: {
                    drawOnChartArea: true, // Draw subtle gridlines
                    color: 'rgba(200, 200, 200, 0.3)', // Light gray gridlines
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    maxTicksLimit: 5,
                    font: {
                        size: 14, // Increase font size for y-axis labels
                        family: 'Arial, sans-serif', // Change font
                    },
                },
                afterFit: (axis) => {
                    axis.width = 180; // Increased width for the y-axis
                },
            },
        },
        layout: {
            padding: {
                left: 10, // Adjust left padding
                right: 20, // Adjust right padding
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`,
                },
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker tooltip background
                titleFont: {
                    size: 14,
                    family: 'Arial, sans-serif',
                },
                bodyFont: {
                    size: 12,
                    family: 'Arial, sans-serif',
                },
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value) => `${value}%`,
                color: 'black',
                font: {
                    size: 14, // Increase font size for data labels
                    family: 'Arial, sans-serif',
                },
            },
        },

    };

    return (

        <div className="max-w-7xl mx-auto mt-4 p-4 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Results</h1>
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Weekly Averages by Academic Year</h4>
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-gray-50 border border-gray-200 ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-6 text-left text-gray-800">Academic Year</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Mood</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Exercise</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Sleep</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Socialisation</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Productivity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yearAverages.map((average, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-6">{average.academic_year_name}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_mood)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_exercise)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_sleep)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_socialisation)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_productivity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Averages by Course</h2>
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-gray-50 border border-gray-200 ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-6 text-left text-gray-800">Course</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Mood</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Exercise</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Sleep</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Socialisation</th>
                            <th className="py-2 px-6 text-left text-gray-800">Average Productivity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseAverages.map((average, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-6">{average.course_name}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_mood)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_exercise)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_sleep)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_socialisation)}</td>
                                <td className="py-2 px-6">{formatNumber(average.avg_productivity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="tag-statistics mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tag Statistics</h2>
                {/* {tagStatistics.length > 0 ? (
                    <ul className="pl-5">
                        {tagStatistics.map((tagStat, index) => (
                            <li key={index} className="text-gray-700">
                                In the last month, {tagStat.percentage}% of students {formatTagText(tagStat.tagName)}.
                            </li>
                        ))}
                    </ul>

                ) : (
                    <p className="text-gray-600">No tags have been recorded by students in the last month.</p>
                )} */}
                {tagStatistics.length > 0 ? (
                    <Bar data={tagChartData} options={tagChartOptions} />
                ) : (
                    <p className="text-gray-600">No tags have been recorded by students in the last month.</p>
                )}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">Yearly Metrics by Academic Year</h2>
            {academicYears.map((year, index) => (
                <div key={index} className="mb-8">
                    <YearlyMetricsGraph academicYear={year.academic_year_name} />
                </div>
            ))}
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Yearly Metrics by Course</h2>
            {courses.map((course, index) => (
                <div key={index} className="mb-8">
                    <CourseMetricsGraph courseName={course.course_name} />
                </div>
            ))}
            <ExportCSVButton />
        </div>

    );
};

export default Results;
