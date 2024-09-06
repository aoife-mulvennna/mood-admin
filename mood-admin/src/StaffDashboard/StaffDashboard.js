import React, { useEffect, useState } from 'react';
import StatisticsCard from './StatisticsCard';
import DistributionPieChart from './DistributionPieChart';
import MetricsOverTime from './MetricsOverTime';
import MoodComparisonChart from './MoodComparisonChart';
import { variables } from '../Variables';

const StaffDashboard = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(['mood']);
  const [selectedRange, setSelectedRange] = useState('7_days');
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsRecordedToday, setStudentsRecordedToday] = useState(0);
  const [courseYearDistribution, setCourseYearDistribution] = useState({ labels: [], datasets: [] });
  const [courseDistribution, setCourseDistribution] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetch(`${variables.API_URL}course-years`)
      .then((res) => res.json())
      .then((data) => setAcademicYears(data))
      .catch((err) => console.error('Error fetching academic years:', err));

    fetch(`${variables.API_URL}course-names`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));

    fetch(`${variables.API_URL}number-of-students`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTotalStudents(data.totalStudents))
      .catch((err) => console.error('Error fetching number of students:', err));

    fetch(`${variables.API_URL}students-recorded-today`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStudentsRecordedToday(data.studentsRecordedToday))
      .catch((err) => console.error('Error fetching students recorded today:', err));

    fetch(`${variables.API_URL}course-year-distribution`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.academic_year_name);
        const counts = data.map((item) => item.count);
        setCourseYearDistribution({
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
              borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error('Error fetching course year distribution:', err));

    fetch(`${variables.API_URL}course-distribution`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.course_name);
        const counts = data.map((item) => item.count);
        setCourseDistribution({
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
              borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error('Error fetching course distribution:', err));
  }, []);

  const toggleMetricSelection = (metric) => {
    setSelectedMetrics((prevSelected) =>
      prevSelected.includes(metric)
        ? prevSelected.filter((m) => m !== metric)
        : [...prevSelected, metric]
    );
  };

  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value); // Update selectedRange on the dashboard
  };

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Statistics Card */}
        <div className="p-4 border border-gray-300">
          <StatisticsCard totalStudents={totalStudents} studentsRecordedToday={studentsRecordedToday} />
        </div>

        {/* Distribution Charts Card */}
        <div className="p-4 border border-gray-300">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <DistributionPieChart data={courseYearDistribution} title="Course Year Distribution" />
            <DistributionPieChart data={courseDistribution} title="Course Distribution" />
          </div>
        </div>

        {/* Metrics Over Time Card */}
        <div className="p-4 border border-gray-300" >
          <div className="h-full flex flex-col">
            <div className="flex-grow mb-8 ">
              <MetricsOverTime selectedMetrics={selectedMetrics} selectedRange={selectedRange} />
            </div>
            <div className="flex flex-wrap justify-center space-x-2 p-4 mt-2">
              {['mood', 'exercise', 'sleep', 'socialisation', 'productivity'].map((metric) => (
                <label key={metric} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric)}
                    onChange={() => toggleMetricSelection(metric)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span className="ml-2 text-sm">{metric.charAt(0).toUpperCase() + metric.slice(1)}</span>
                </label>
              ))}

              <div className="flex justify-center mt-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="date_range"
                    value="7_days"
                    checked={selectedRange === '7_days'}
                    onChange={handleRangeChange}
                  />
                  Last 7 Days
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="date_range"
                    value="1_month"
                    checked={selectedRange === '1_month'}
                    onChange={handleRangeChange}
                  />
                  Last Month
                </label>
                <label>
                  <input
                    type="radio"
                    name="date_range"
                    value="1_year"
                    checked={selectedRange === '1_year'}
                    onChange={handleRangeChange}
                  />
                  Last Year
                </label>
              </div>
            </div>
          </div>
        </div>


        <div className="p-4 border border-gray-300">
          <MoodComparisonChart />
        </div>
      </div>
    </div >
  );
};

export default StaffDashboard;
