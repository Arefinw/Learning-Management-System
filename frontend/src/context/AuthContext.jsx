/**
 * @file AuthContext.jsx
 * @description This file defines the authentication context for the application.
 * It provides authentication state and functions to the rest of the application.
 * @module context/AuthContext
 * @requires react
 * @requires ../services/api
 */

import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

/**
 * @component AuthProvider
 * @description Provides authentication state and functions to its children.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * @function checkAuthStatus
   * @description Checks the user's authentication status by verifying the token.
   * @returns {Promise<void>}
   */
  const checkAuthStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await api.get("/api/auth/me");
        setIsAuthenticated(true);
        setUser(res.data.data);
      } catch (err) {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setUser(null);
        console.error("Auth check failed", err);
      }
    } else {
      delete api.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * @function login
   * @description Logs the user in.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} Whether the login was successful.
   */
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      await checkAuthStatus();
      return true;
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      return false;
    }
  };

  /**
   * @function register
   * @description Registers a new user.
   * @param {object} userData - The user's registration data.
   * @returns {Promise<boolean>} Whether the registration was successful.
   */
  const register = async (userData) => {
    try {
      const res = await api.post("/api/auth/register", userData);
      localStorage.setItem("token", res.data.token);
      await checkAuthStatus();
      return true;
    } catch (err) {
      console.error("Registration failed", err.response?.data || err.message);
      return false;
    }
  };

  /**
   * @function logout
   * @description Logs the user out.
   */
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
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