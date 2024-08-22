import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';
import ExportCSVButton from '../ExportCSV';
import YearlyMetricsGraph from './YearlyMetricsGraph';
import CourseMetricsGraph from './CourseMetricsGraph';
import AssignmentCorrelation from './AssignmentCorrelation';
import ConcerningCohorts from './ConcerningCohorts';
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
    const [selectedYear1, setSelectedYear1] = useState('');
    const [selectedYear2, setSelectedYear2] = useState('');
    const [selectedCourse1, setSelectedCourse1] = useState('');
    const [selectedCourse2, setSelectedCourse2] = useState('');

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
        fetchAcademicYears(token);
        fetchCourses(token);
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
                const sortedData = (data.tagStatistics || []).sort((a, b) => b.percentage - a.percentage);
                setTagStatistics(sortedData);
            })
            .catch((err) => {
                console.error('Error fetching tag statistics:', err);
            });
    };
    // Fetch academic years
    const fetchAcademicYears = (token) => {
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
    };
    // Fetch courses
    const fetchCourses = (token) => {
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
    };

    const handleYearChange = (e, setYear) => {
        setYear(e.target.value);
    };

    const handleCourseChange = (e, setCourse) => {
        setCourse(e.target.value);
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
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // A nice blue color
                borderColor: 'rgba(54, 162, 235, 1)', // Darker blue border
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 0.75,
            },
        ],
    };

    const tagChartOptions = {
        indexAxis: 'y', // This makes the bars upright
        scales: {
            y: {
                beginAtZero: true, // Start the y-axis at zero
                ticks: {
                    font: {
                        size: 14, // Increase font size for y-axis labels
                    },
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)', // Light gray gridlines
                },
            },
            x: {
                stacked: true,
                ticks: {
                    font: {
                        size: 14, // Increase font size for x-axis labels
                    },

                },
                grid: {
                    display: false, // Hide vertical gridlines for a cleaner look
                },
                max: 100,
            },
        },
        plugins: {
            legend: {
                display: false, // Hide the legend for simplicity
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`, // Show percentage in the tooltip
                },
            },
        },
        maintainAspectRatio: false,
    };
    const chartHeight = Math.max(400, tagStatistics.length * 50);

    return (

        <div className="max-w-7xl mx-auto mt-4 p-4 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Results</h1>
            <ExportCSVButton />
           
            <div className="flex justify-between">
            <div className="flex-1 mr-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Weekly Averages by Academic Year</h4>
            <div className="overflow-x-auto mb-6">
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
         
            </div>
            <div className="w-1/3">
            <ConcerningCohorts />
            </div>
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
                <div style={{ height: chartHeight }}>
                    {tagStatistics.length > 0 ? (
                        <Bar data={tagChartData} options={tagChartOptions} />
                    ) : (
                        <p className="text-gray-600">No tags have been recorded by students in the last month.</p>
                    )}
                </div>
            </div>

            {/* <h2 className="text-xl font-semibold text-gray-800 mb-6">Yearly Metrics by Academic Year</h2>
            {academicYears.map((year, index) => (
                <div key={index} className="mb-8">
                    <YearlyMetricsGraph academicYear={year.academic_year_name} />
                </div>
            ))} */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Compare Yearly Metrics</h2>
            <div className="flex space-x-4 mb-6">
                <select
                    value={selectedYear1}
                    onChange={(e) => handleYearChange(e, setSelectedYear1)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Year 1</option>
                    {academicYears.map((year) => (
                        <option key={year.academic_year_name} value={year.academic_year_name}>
                            {year.academic_year_name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedYear2}
                    onChange={(e) => handleYearChange(e, setSelectedYear2)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Year 2</option>
                    {academicYears.map((year) => (
                        <option key={year.academic_year_name} value={year.academic_year_name}>
                            {year.academic_year_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedYear1 && !selectedYear2 && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div>
                        <YearlyMetricsGraph academicYear={selectedYear1} />
                    </div>
                </div>
            )}

            {selectedYear2 && !selectedYear1 && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div>
                        <YearlyMetricsGraph academicYear={selectedYear2} />
                    </div>
                </div>
            )}

            {selectedYear1 && selectedYear2 && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <YearlyMetricsGraph academicYear={selectedYear1} />
                    </div>
                    <div>
                        <YearlyMetricsGraph academicYear={selectedYear2} />
                    </div>
                </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-6">Compare Course Metrics</h2>
            <div className="flex space-x-4 mb-6">
                <select
                    value={selectedCourse1}
                    onChange={(e) => handleCourseChange(e, setSelectedCourse1)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Course 1</option>
                    {courses.map((course) => (
                        <option key={course.course_name} value={course.course_name}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedCourse2}
                    onChange={(e) => handleCourseChange(e, setSelectedCourse2)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Course 2</option>
                    {courses.map((course) => (
                        <option key={course.course_name} value={course.course_name}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCourse1 && !selectedCourse2 && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div>
                        <CourseMetricsGraph courseName={selectedCourse1} />
                    </div>
                </div>
            )}

            {selectedCourse2 && !selectedCourse1 && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div>
                        <CourseMetricsGraph courseName={selectedCourse2} />
                    </div>
                </div>
            )}

            {selectedCourse1 && selectedCourse2 && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <CourseMetricsGraph courseName={selectedCourse1} />
                    </div>
                    <div>
                        <CourseMetricsGraph courseName={selectedCourse2} />
                    </div>
                </div>
            )}
<div>


</div>
          
        </div>
    );
};

export default Results;
