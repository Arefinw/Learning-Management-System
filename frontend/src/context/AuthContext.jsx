import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { message } from 'antd'; // Import Ant Design message component

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api
        .get('/api/auth/me')
        .then((res) => {
          setIsAuthenticated(true);
          setUser(res.data.data); // Access data property
          console.log('User authenticated', res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          message.error('Failed to authenticate user. Please log in again.');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await api.post('/api/auth/login', body, config);
      localStorage.setItem('token', res.data.token);
      console.log('Token set', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const userRes = await api.get('/api/auth/me');
      console.log('User authenticated', userRes.data.data);
      setIsAuthenticated(true);
      setUser(userRes.data.data); // Access data property
      message.success('Login successful!');
      return true;
    } catch (err) {
      console.error(err.response.data);
      message.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async ({ name, email, password }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await api.post('/api/auth/register', body, config);
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const userRes = await api.get('/api/auth/me');
      setIsAuthenticated(true);
      setUser(userRes.data.data); // Access data property
      message.success('Registration successful!');
      return true;
    } catch (err) {
      console.error(err.response.data);
      message.error(err.response?.data?.error || 'Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    message.info('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
