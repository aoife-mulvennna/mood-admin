import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Logout.css';

const StaffLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirm = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 max-w-md text-center">
      <h2 className="text-2xl font-bold mb-4">Are you sure you want to log out?</h2>
      <div className="flex justify-center space-x-4">
     
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400 transition"
          onClick={handleCancel}
        >
          No, go back
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition"
          onClick={handleConfirm}
        >
          Yes, I'm sure
        </button>
      </div>
    </div>
  </div>
  );
};

export default StaffLogout;