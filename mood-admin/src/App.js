import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import qubLogo from './Photos/QUB_Logo.jpg';
import StaffDashboard from './StaffDashboard/StaffDashboard';
import StudentList from './StudentList';
import StaffLogin from './Login/StaffLogin';
import StaffLogout from './StaffLogout/StaffLogout';
import StaffResources from './StaffResources/StaffResources';
import StudentOptions from './StudentOptions';
import ComposeEmail from './ComposeEmail';
import StudentProfile from './StudentProfile';
import Results from './Results/Results';
import LandingPage from './LandingPage';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </BrowserRouter>
  );
}

const Main = () => {
  const { token } = useAuth();
  const location = useLocation();
  const showTopBar = !['/stafflogin', '/', '/stafflogout'].includes(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="bg-gray-100 text-gray-900">
      {showTopBar && token && (
        <header className="bg-gray-800 text-white flex justify-between items-center px-4 h-20">
          <div className="flex items-center space-x-4">
            <img src={qubLogo} className="w-32 h-auto mr-2 mt-3" alt="QUB Logo" />
            <span className="text-xl font-bold">QUB Student Pulse - Staff</span>
          </div>
          <nav className="flex-1 flex justify-between items-center ml-8">
            <div className="flex space-x-4">
              <NavLink className={({ isActive }) => isActive ? 'text-white font-semibold bg-gray-700 px-4 py-2' : 'text-gray-200 bg-gray-600 font-semibold px-4 py-2 hover:text-white '} to="/staffdashboard">
                Dashboard
              </NavLink>
              <NavLink className={({ isActive }) => isActive ? 'text-white font-semibold bg-gray-700 px-4 py-2' : 'text-gray-200 bg-gray-600 font-semibold px-4 py-2 hover:text-white'} to="/studentlist">
                Students
              </NavLink>
              <NavLink className={({ isActive }) => isActive ? 'text-white font-semibold bg-gray-700 px-4 py-2' : 'text-gray-200 bg-gray-600 font-semibold px-4 py-2 hover:text-white'} to="/results">
                Results
              </NavLink>
              <NavLink className={({ isActive }) => isActive ? 'text-white font-semibold bg-gray-700 px-4 py-2' : 'text-gray-200 bg-gray-600 font-semibold px-4 py-2 hover:text-white'} to="/staffresources">
                Resources
              </NavLink>
            </div>
            <div className="flex space-x-4">
              <NavLink className="bg-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white font-semibold px-4 py-2" to="/stafflogout">
                Logout
              </NavLink>
            </div>
          </nav>
          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </header>
      )}

      <aside className={`fixed inset-y-0 right-0 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 bg-gray-800 text-white w-64 p-6 z-50 lg:hidden`}>
        <button className="mb-4 text-white" onClick={toggleSidebar}>Close</button>
        <nav className="flex flex-col space-y-4">
          <NavLink className="hover:text-gray-300" to="/staffdashboard" onClick={toggleSidebar}>
            Dashboard
          </NavLink>
          <NavLink className="hover:text-gray-300" to="/studentlist" onClick={toggleSidebar}>
            Students
          </NavLink>
          <NavLink className="hover:text-gray-300" to="/results" onClick={toggleSidebar}>
            Results
          </NavLink>
          <NavLink className="hover:text-gray-300" to="/staffresources" onClick={toggleSidebar}>
            Resources
          </NavLink>
          <NavLink className="hover:text-gray-300" to="/stafflogout" onClick={toggleSidebar}>
            Logout
          </NavLink>
        </nav>
      </aside>

      <main className="p-6">
      <Routes>
          <Route path="/stafflogin" element={<StaffLogin />} />
          <Route path="/" element={<LandingPage />} />

          {/* Private Routes */}
          <Route path="/staffdashboard" element={<PrivateRoute element={<StaffDashboard />} />} />
          <Route path="/studentlist" element={<PrivateRoute element={<StudentList />} />} />
          <Route path="/staffresources" element={<PrivateRoute element={<StaffResources />} />} />
          <Route path="/student-profile/:student_id" element={<PrivateRoute element={<StudentProfile />} />} />
          <Route path="/stafflogout" element={<PrivateRoute element={<StaffLogout />} />} />
          <Route path="/write-email/:student_id" element={<PrivateRoute element={<ComposeEmail />} />} />
          <Route path="/results" element={<PrivateRoute element={<Results />} />} />
          <Route path="/options" element={<PrivateRoute element={<StudentOptions />} />} /> {/* Protected route for options */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
