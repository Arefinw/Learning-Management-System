import React from 'react';

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