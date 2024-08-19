import React from 'react';

const Statistics = ({ totalStudents, studentsRecordedToday }) => {
  return (
    <div className="text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      <div className="space-y-4">
        <div className="text-lg">
          <h3 className="font-semibold">Total Students Signed Up: {totalStudents}</h3>
        </div>
        <div className="text-lg">
          <h3 className="font-semibold">Students Recorded Today: {studentsRecordedToday}</h3>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
