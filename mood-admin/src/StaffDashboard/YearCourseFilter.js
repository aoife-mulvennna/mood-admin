import React from 'react';

const YearCourseFilter = ({ academicYears, courses, selectedYears, setSelectedYears, selectedCourses, setSelectedCourses }) => {

  const handleYearChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedYears((prevYears) => [...prevYears, value]);
    } else {
      setSelectedYears((prevYears) => prevYears.filter((year) => year !== value));
    }
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCourses((prevCourses) => [...prevCourses, value]);
    } else {
      setSelectedCourses((prevCourses) => prevCourses.filter((course) => course !== value));
    }
  };

  return (
    <div className="text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Select Academic Years</h2>
      <div className="space-y-2">
        {academicYears.map((year) => (
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

export default YearCourseFilter;
