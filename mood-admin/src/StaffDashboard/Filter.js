import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';

const Filter = ({ metrics, setMetrics, selectedYears, setSelectedYears, selectedCourses, setSelectedCourses }) => {
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${variables.API_URL}course-years`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setYears(data))
      .catch((err) => console.error('Error fetching years:', err));

    fetch(`${variables.API_URL}course-names`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  const handleMetricChange = (e) => {
    const { name, checked } = e.target;
    setMetrics((prevMetrics) => ({ ...prevMetrics, [name]: checked }));
  };

  const handleYearChange = (e) => {
    const { value, checked } = e.target;
    if (value === 'all') {
      if (checked) {
        setSelectedYears(years.map((year) => year.academic_year_id));
      } else {
        setSelectedYears([]);
      }
    } else {
      if (checked) {
        setSelectedYears((prevYears) => [...prevYears, parseInt(value)]);
      } else {
        setSelectedYears((prevYears) => prevYears.filter((year) => year !== parseInt(value)));
      }
    }
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (value === 'all') {
      if (checked) {
        setSelectedCourses(courses.map((course) => course.course_id));
      } else {
        setSelectedCourses([]);
      }
    } else {
      if (checked) {
        setSelectedCourses((prevCourses) => [...prevCourses, parseInt(value)]);
      } else {
        setSelectedCourses((prevCourses) => prevCourses.filter((course) => course !== parseInt(value)));
      }
    }
  };

  return (
    <div className="text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Select Metrics</h2>
      <div className="space-y-2">
        {Object.keys(metrics).map((metric) => (
          <label key={metric} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={metric}
              checked={metrics[metric]}
              onChange={handleMetricChange}
              className="form-checkbox text-gray-700"
            />
            <span className="capitalize">{metric}</span>
          </label>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-6 mb-4">Select Academic Years</h2>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value="all"
            checked={selectedYears.length === years.length}
            onChange={handleYearChange}
            className="form-checkbox text-gray-700"
          />
          <span>All Years</span>
        </label>
        {years.map((year) => (
          <label key={year.academic_year_id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={year.academic_year_id}
              checked={selectedYears.includes(year.academic_year_id)}
              onChange={handleYearChange}
              className="form-checkbox text-gray-700"
            />
            <span>{year.academic_year_name}</span>
          </label>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-6 mb-4">Select Courses</h2>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value="all"
            checked={selectedCourses.length === courses.length}
            onChange={handleCourseChange}
            className="form-checkbox text-gray-700"
          />
          <span>All Courses</span>
        </label>
        {courses.map((course) => (
          <label key={course.course_id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={course.course_id}
              checked={selectedCourses.includes(course.course_id)}
              onChange={handleCourseChange}
              className="form-checkbox text-gray-700"
            />
            <span>{course.course_name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filter;
