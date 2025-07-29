/**
 * @file Navbar.jsx
 * @description A very basic navigation bar component.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
      <div className="auth-links">
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Login</Link>
        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
