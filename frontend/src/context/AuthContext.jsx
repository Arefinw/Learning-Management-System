import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
