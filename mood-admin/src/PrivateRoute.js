// PrivateStaffRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element }) => {
  const { token } = useAuth();

  return token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
