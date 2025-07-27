import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProjectViewPage from '../pages/ProjectViewPage';
import PathwayPlayerPage from '../pages/PathwayPlayerPage';

/**
 * @description Defines the application's routes, including protected routes that require authentication.
 * @returns {JSX.Element} - The routed application components.
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pathways/:pathwayId"
        element={
          <ProtectedRoute>
            <PathwayPlayerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProjectViewPage />
          </ProtectedRoute>
        }
      />
      {/* Add other protected routes here */}
    </Routes>
  );
};

export default AppRoutes;
