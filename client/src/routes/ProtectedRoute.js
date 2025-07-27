import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * @description A wrapper component that checks if the user is authenticated.
 * If authenticated, it renders the children components. Otherwise, it redirects to the login page.
 * @param {object} { children } - React children to be rendered if authenticated.
 * @returns {JSX.Element} - Rendered children or a Navigate component for redirection.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
