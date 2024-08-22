import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { variables } from './Variables';

const StudentProfile = () => {
  const { student_id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
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
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg">
      <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">Student Profile</h3>
      <div className="mb-4">
        <p><strong>Name:</strong> {student.student_name}</p>
        <p><strong>Number:</strong> {student.student_number}</p>
        <p><strong>Email:</strong> {student.student_email}</p>
        <p><strong>Course:</strong> {student.course_name}</p>
        <p><strong>Academic Year:</strong> {student.academic_year_name}</p>
        <p><strong>Last Recording:</strong> {student.last_recording_date ? new Date(student.last_recording_date).toLocaleDateString() : 'No record'}</p>
        {daysUntilNextAssignment !== null && (
          <p><strong>Next Assignment:</strong> {daysUntilNextAssignment} day(s) remaining</p>
        )}
                {daysSinceLastAssignment !== null && (
          <p><strong>Last Assignment:</strong> {daysSinceLastAssignment} day(s) ago</p>
        )}
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSendEmail}
          className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
        >
          Send Email
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
