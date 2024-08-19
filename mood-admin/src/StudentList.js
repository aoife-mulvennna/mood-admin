import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { variables } from './Variables';
import jwtDecode from 'jwt-decode';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const downloadCSV = () => {
    const token = sessionStorage.getItem('token');

    fetch(`${variables.API_URL}export-studentlist-csv`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Failed to download CSV');
      }
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Get the current date and time to include in the filename
      const currentDateTime = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
      a.download = `StudentList_${currentDateTime}.csv`;

      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      console.error('Error downloading CSV:', error);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${variables.API_URL}students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError('Failed to fetch students.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setStudents(data.students);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getMoodIcon = (moodTrend) => {
    if (moodTrend === 'no record') {
      return <span>No record</span>;
    } else if (moodTrend > 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-4 p-4 bg-white">
      <h3 className="text-center text-2xl font-semibold mb-2 text-gray-800">All Students</h3>
      <button
        onClick={downloadCSV}
        className="mb-4 bg-green-500 text-white p-4 py-2 font-semibold hover:bg-green-600 transition"
      >
        Download  CSV
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Student Name</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Student Number</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Mood Trend</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Last Recording</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-300">{student.student_name}</td>
                <td className="py-2 px-4 border-b border-gray-300">{student.student_number}</td>
                <td className="py-2 px-4 border-b border-gray-300">{getMoodIcon(student.moodTrend)}</td>
                <td className="py-2 px-4 border-b border-gray-300">{student.last_recording_date ? new Date(student.last_recording_date).toLocaleDateString() : 'No record'}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button
                    onClick={() => navigate(`/student-profile/${student.student_id}`)}
                    className="bg-blue-500 text-white px-4 py-2 font-semibold hover:bg-blue-600 transition"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
