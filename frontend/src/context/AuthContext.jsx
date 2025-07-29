import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: useEffect - checking for token (isAuthenticated changed)');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('AuthContext: Token found in localStorage', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api
        .get('/api/auth/me')
        .then((res) => {
          setIsAuthenticated(true);
          setUser(res.data.data); // Access data property
          // console.log('AuthContext: User authenticated successfully', res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('AuthContext: Failed to authenticate user with token', err);
          console.error('AuthContext: Failed to authenticate user. Please log in again.');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          localStorage.removeItem('token'); // Clear invalid token
        });
    } else {
      console.log('AuthContext: No token found in localStorage');
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext: Attempting login for', email);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await api.post('/api/auth/login', body, config);
      localStorage.setItem('token', res.data.token);
      console.log('AuthContext: Login successful, token stored', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const userRes = await api.get('/api/auth/me');
      console.log('AuthContext: User data fetched after login', userRes.data.data);
      setIsAuthenticated(true);
      setUser(userRes.data.data); // Access data property
      console.log('AuthContext: Login process completed successfully!');
      return true;
    } catch (err) {
      console.error('AuthContext: Login failed', err.response?.data || err.message);
      console.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async ({ name, email, password }) => {
    console.log('AuthContext: Attempting registration for', email);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await api.post('/api/auth/register', body, config);
      localStorage.setItem('token', res.data.token);
      console.log('AuthContext: Registration successful, token stored', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const userRes = await api.get('/api/auth/me');
      setIsAuthenticated(true);
      setUser(userRes.data.data); // Access data property
      console.log('AuthContext: Registration process completed successfully!', userRes.data.data);
      return true;
    } catch (err) {
      console.error('AuthContext: Registration failed', err.response?.data || err.message);
      message.error(err.response?.data?.error || 'Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    console.log('AuthContext: Logged out successfully.');
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
