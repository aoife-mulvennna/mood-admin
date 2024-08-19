import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        if (isTokenExpired(decoded)) {
          handleSessionExpired();
        }
      } catch (error) {
        console.error('Invalid token:', error);
        handleSessionExpired();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const isTokenExpired = (decodedToken) => {
    return decodedToken.exp * 1000 < Date.now();
  };

  const handleSessionExpired = () => {
    logout();
    navigate('/'); // Redirect to the landing page or login page when the session expires
  };

  
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setToken(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
