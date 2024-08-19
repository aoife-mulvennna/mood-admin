import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { variables } from './Variables';

const ComposeEmail = () => {
  const { student_id } = useParams();
  const [student, setStudent] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
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
        setError('Failed to fetch student details.');
        return;
      }

      const data = await response.json();
      setStudent(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const emailData = {
      to: student.student_email,
      subject,
      message,
    };

    try {
      const response = await fetch(`${variables.API_URL}send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        setError('Failed to send email.');
        return;
      }

      setSuccess('Email sent successfully.');
      setSubject('');
      setMessage('');
    } catch (error) {
      setError(error.message);
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
        <p className="text-gray-600">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg">
      <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">Compose Email to {student.student_name}</h3>
      {success && (
        <div className="text-green-500 text-center mb-4">{success}</div>
      )}
      <form onSubmit={handleSendEmail}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="6"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComposeEmail;
