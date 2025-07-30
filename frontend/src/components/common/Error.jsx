/**
 * @file Error.jsx
 * @description This component displays a generic error message.
 * It is used throughout the application to provide user-friendly feedback when an error occurs.
 * @module components/common/Error
 * @requires react
 */

import React from 'react';

/**
 * @component Error
 * @description A simple component to display an error message.
 * @param {object} props - The component props.
 * @param {string} [props.message="An unexpected error occurred."] - The error message to display.
 * @returns {JSX.Element} The error message component.
 */
const Error = ({ message = "An unexpected error occurred." }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '1.2rem',
      color: '#D32F2F', // A common error color (red)
      backgroundColor: '#FFEBEE', // Light red background
      padding: '20px',
      borderRadius: '8px',
      margin: '20px',
      border: '1px solid #EF9A9A',
    }}>
      Error: {message}
    </div>
  );
};

export default Error;
