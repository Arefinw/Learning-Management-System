/**
 * @file Navbar.jsx
 * @description This component renders the main navigation bar for the application.
 * It displays different links based on the user's authentication status.
 * @module components/layout/Navbar
 * @requires react
 * @requires react-router-dom
 * @requires ../../context/AuthContext
 */

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * @component Navbar
 * @description The main navigation bar component.
 * It includes links to the home page, dashboard, and other sections, as well as login/logout buttons.
 * @returns {JSX.Element} The navigation bar component.
 */
const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  /**
   * @function handleLogout
   * @description Logs the user out by calling the logout function from the AuthContext.
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div className="logo">
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          LMS
        </Link>
      </div>
      {isAuthenticated && (
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
        }}>
          <li style={{ margin: '0 1rem' }}><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
          <li style={{ margin: '0 1rem' }}><Link to="/workspaces" style={{ color: 'white', textDecoration: 'none' }}>Workspaces</Link></li>
          <li style={{ margin: '0 1rem' }}><Link to="/projects" style={{ color: 'white', textDecoration: 'none' }}>Projects</Link></li>
          <li style={{ margin: '0 1rem' }}><Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link></li>
          <li style={{ margin: '0 1rem' }}><Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</Link></li>
        </ul>
      )}
      <div className="auth-links">
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;