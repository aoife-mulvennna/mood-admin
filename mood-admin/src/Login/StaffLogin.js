import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { variables } from '../Variables.js';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const StaffLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [staffNumber, setStaffNumber] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('Attempting login with:', { staffNumber, staffPassword });

    try {
      const response = await fetch(variables.API_URL + 'login/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({staffNumber, staffPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token); // Assuming login sets the token in context
        sessionStorage.setItem('token', data.token); // Store token in sessionStorage
        console.log('Login successful');
        navigate('/staffdashboard');
      } else {
        console.log('Login failed:', data.message);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in');
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg max-w-md w-full">
      <h3 className="text-2xl font-bold text-center mb-6">Please Log In</h3>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Staff Number</label>
          <input
            type="number"
            value={staffNumber}
            onChange={(e) => setStaffNumber(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={staffPassword}
            onChange={(e) => setStaffPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Submit
          </button>
          <Link to="/create-account" className="text-sm text-red-500 hover:underline">
            Don't have an account? Sign up here
          </Link>
        </div>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
            Forgot your password? Click here to reset it.
          </Link>
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default StaffLogin;