import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/stafflogin');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to QUB Pulse Staff Portal</h1>
        <button
          onClick={handleLoginRedirect}
          className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
