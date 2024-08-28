import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import qubLogo from './Photos/QUB_Logo.jpg';
import { useAuth } from './AuthContext';

const StaffNavbar = () => {
  const { token, logout } = useAuth();
  const location = useLocation();
  const showTopBar = location.pathname !== '/stafflogin';

  return (
    <div className="App font-sans relative">
      {showTopBar && token && (
        <>
          <div className="top-bar flex justify-between items-center bg-gray-800 h-20 px-6">
            <div className="flex items-center">
              <img src={qubLogo} className="logo w-32 h-auto mr-2 mt-3" alt="qub logo" />
              <div className="text-white text-xl font-bold ml-2">QUB Staff Portal</div>
            </div>
            <div className="flex items-center hidden lg:flex lg:w-0 lg:items-center lg:justify-end lg:flex-1 lg:gap-x-12">
              <nav className="navbar flex gap-4">
                <NavLink className="nav-link" to="/staffdashboard">Staff Dashboard</NavLink>
                <NavLink className="nav-link" to="/studentlist">Student List</NavLink>
                <button className="nav-link grey-button" onClick={logout}>Sign out</button>
              </nav>
            </div>
          </div>

          <div className="lg:hidden">
            <button className="text-white bg-gray-700 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default StaffNavbar;
