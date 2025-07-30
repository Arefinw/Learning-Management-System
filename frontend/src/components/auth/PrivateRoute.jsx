/**
 * @file PrivateRoute.jsx
 * @description This component protects routes that require authentication.
 * It checks the user's authentication status from the AuthContext.
 * If the user is not authenticated, it redirects them to the login page.
 * While checking for authentication, it displays a loading indicator.
 * @module components/auth/PrivateRoute
 * @requires react
 * @requires react-router-dom
 * @requires ../../context/AuthContext
 * @requires ../common/Loading
 */

import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../common/Loading';

/**
 * @component PrivateRoute
 * @description A component that renders its children only if the user is authenticated.
 * Otherwise, it redirects to the login page, preserving the intended destination.
 * @returns {JSX.Element} The child components if authenticated, or a redirect to the login page.
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Display a loading indicator while authentication status is being checked.
  if (loading) {
    return <Loading />;
  }

  // If the user is not authenticated, redirect to the login page.
  // The current location is passed in the state so that the user can be redirected back after logging in.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the nested routes.
  return <Outlet />;
};

export default PrivateRoute;
