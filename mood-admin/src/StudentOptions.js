import React, { useState } from 'react';
import { variables } from './Variables';

const StudentOptions = () => {
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddCourse = async () => {
    if (!courseName) {
      setMessage('Course name cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${variables.API_URL}add-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ course_name: courseName }),
      });

      if (response.ok) {
        setMessage('Course added successfully.');
        setCourseName(''); // Clear the input
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add course: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setMessage('Failed to add course due to a network error.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded">
      <h3 className="text-center text-2xl font-semibold mb-4 text-gray-800">Add New Course</h3>
      <input
        type="text"
        placeholder="Course name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleAddCourse}
        className="bg-blue-500 text-white px-4 py-2 font-semibold hover:bg-blue-600 transition w-full"
      >
        Add Course
      </button>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default StudentOptions;
