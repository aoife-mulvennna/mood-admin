import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { variables } from './Variables';
import StudentMetricsOverTime from './StudentMetricsOverTime';

const StudentProfile = () => {
  const { student_id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState(['mood', 'exercise', 'sleep', 'socialisation', 'productivity']);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${variables.API_URL}student-profile/${student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError('Failed to fetch student profile.');
        return;
      }

      const data = await response.json();
      setStudent(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMetricChange = (metric) => {
    setSelectedMetrics((prevMetrics) =>
      prevMetrics.includes(metric)
        ? prevMetrics.filter((m) => m !== metric)
        : [...prevMetrics, metric]
    );
  };

  const handleBackToStudentList = () => {
    navigate('/studentlist');
  };

  const handleSendEmail = () => {
    navigate(`/write-email/${student_id}`);
  };

  const calculateDaysUntilNextAssignment = (nextAssignmentDeadline) => {
    if (!nextAssignmentDeadline) return null;
    const deadlineDate = new Date(nextAssignmentDeadline);
    const today = new Date();
    const timeDiff = deadlineDate - today;
    const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 ? daysUntil : null;
  };

  const calculateDaysSinceLastAssignment = (lastAssignmentDeadline) => {
    if (!lastAssignmentDeadline) return null;
    const deadlineDate = new Date(lastAssignmentDeadline);
    const today = new Date();
    const timeDiff = today - deadlineDate;
    const daysSince = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysSince >= 0 ? daysSince : null;
  };

  const getTrendIcon = (value) => {
    if (value >= 3) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
      );
    } else if (value > 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
      );
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading student profile...</p>
      </div>
    );
  }

  const daysUntilNextAssignment = calculateDaysUntilNextAssignment(student.next_assignment_deadline);
  const daysSinceLastAssignment = calculateDaysSinceLastAssignment(student.last_assignment_deadline);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto mt-4 p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
          {/* Left column: Back button */}
          <div className="flex-1">
          <button
  onClick={handleBackToStudentList}
  className="bg-gray-500 text-white px-4 py-2 font-semibold hover:bg-gray-600 transition flex items-center"
>
  <span className="mr-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  </span>
  <span>Go Back</span>
</button>

          </div>

          {/* Center column: Title */}
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Student Profile</h3>
          </div>

          {/* Right column: Send Email button */}
          <div className="flex-1 text-right">
            <button
              onClick={handleSendEmail}
              className="bg-blue-500 text-white px-4 py-2 font-semibold hover:bg-blue-600 transition"
            >
              Send Email
            </button>
          </div>
        </div>

      
        <div className="flex justify-between mb-4 ml-64">
          <div>
            <p><strong>Name:</strong> {student.student_name}</p>
            <p><strong>Student Number:</strong> {student.student_number}</p>
            <p><strong>Email:</strong> {student.student_email}</p>
            <p><strong>Course Name:</strong> {student.course_name}</p>
            <p><strong>Academic Year:</strong> {student.academic_year_name}</p>
            <p><strong>Last Recording:</strong> {student.last_recording_date ? new Date(student.last_recording_date).toLocaleDateString() : 'No record'}</p>
            {daysUntilNextAssignment !== null && (
              <p><strong>Next Assignment:</strong> {daysUntilNextAssignment} day(s) remaining</p>
            )}
            {daysSinceLastAssignment !== null && (
              <p><strong>Last Assignment:</strong> {daysSinceLastAssignment} day(s) ago</p>
            )}
          </div>
       
        </div>

        {/* 7-Day Average Stats */}
        <div className="bg-gray-100 p-4 shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-center">7-Day Average Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Mood', key: 'avg_mood_7_day' },
              { label: 'Exercise', key: 'avg_exercise_7_day' },
              { label: 'Sleep', key: 'avg_sleep_7_day' },
              { label: 'Socialisation', key: 'avg_socialisation_7_day' },
              { label: 'Productivity', key: 'avg_productivity_7_day' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center bg-white p-2 ">
                <span className="font-semibold">{item.label}:</span>
                <span className="flex items-center">
                  {student[item.key]}/5 {getTrendIcon(parseFloat(student[item.key]))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Over the Last 30 Days */}
       {/* Metrics Over the Last 30 Days */}
       <div className="bg-gray-100 p-4 mt-6">
          <h4 className="text-xl font-semibold mb-4 text-center">Analysis of Student Well-being Over Time</h4>
          <StudentMetricsOverTime
            studentId={student_id}
            selectedMetrics={selectedMetrics}
            setSelectedMetrics={setSelectedMetrics} // Pass this down to allow metric selection
          />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
