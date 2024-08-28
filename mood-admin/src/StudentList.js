import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { variables } from './Variables';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedAcademicYears, setSelectedAcademicYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchAcademicYears();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${variables.API_URL}course-names`);
      const data = await response.json();
      console.log('Courses:', data);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await fetch(`${variables.API_URL}course-years`);
      const data = await response.json();
      setAcademicYears(data);
      console.log('Academic Years:', data);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

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
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data.students);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setSelectedCourses(prev =>
      isChecked ? [...prev, value] : prev.filter(course => course !== value)
    );
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setSelectedAcademicYears(prev =>
      isChecked ? [...prev, value] : prev.filter(year => year !== value)
    );
  };

  const getMoodIcon = ( moodTrend) => {
    console.log(`Evaluating moodTrend:`, moodTrend);  // Log studentId and moodTrend

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

  const filteredStudents = students
    .filter(student => {
      const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(student.course_name);
      const matchesYear = selectedAcademicYears.length === 0 || selectedAcademicYears.includes(student.academic_year_name);
      const matchesSearch = student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_number.toString().toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCourse && matchesYear && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortOption) return 0;

      const [key, order] = sortOption.split('-');
      if (order === 'asc') {
        return a[key].toString().localeCompare(b[key].toString());
      } else {
        return b[key].toString().localeCompare(a[key].toString());
      }
    });

  console.log('Filtered Students:', filteredStudents);

  return (
    <div className="max-w-7xl mx-auto mt-4 p-4 bg-white">
      <h3 className="text-center text-2xl font-semibold mb-2 text-gray-800">All Students</h3>

      <div className="mb-4 flex items-end gap-4 ">
        <div className="w-1/3">
          <label className="block mb-2 font-semibold">Filter by Course:</label>
          <div className="h-32 overflow-y-auto border border-gray-300 px-2">
            {courses.map((course) => (
              <div key={course.course_id}>
                <input
                  type="checkbox"
                  value={course.course_name}
                  checked={selectedCourses.includes(course.course_name)}
                  onChange={handleCourseChange}
                  className="mr-2"
                />
                <span>{course.course_name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3">
          <label className="block mb-2 font-semibold">Filter by Academic Year:</label>
          <div className="h-32 overflow-y-auto border border-gray-300 px-2">
            {academicYears.map((year) => (
              <div key={year.academic_year_id}>
                <input
                  type="checkbox"
                  value={year.academic_year_name}
                  checked={selectedAcademicYears.includes(year.academic_year_name)}
                  onChange={handleYearChange}
                  className="mr-2"
                />
                <span>{year.academic_year_name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3">
          <label className="block mb-2 font-semibold">Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 w-full"
          >
            <option value="">Sort By</option>
            <option value="student_name-asc">Student Name (A-Z)</option>
            <option value="student_name-desc">Student Name (Z-A)</option>
            <option value="student_number-asc">Student Number (Ascending)</option>
            <option value="student_number-desc">Student Number (Descending)</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Name or Student Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 w-2/3"
        />
        <button
          onClick={() => navigate('/options')}
          className="bg-purple-500 text-white px-4 py-2 font-semibold hover:bg-purple-600 transition"
        >
          Options
        </button>
        <button
          onClick={downloadCSV}
          className="bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <span>Download CSV</span>
        </button>
      </div>

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
            {filteredStudents.map((student, index) => (
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
