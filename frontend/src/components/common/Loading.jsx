import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '1.2rem',
      color: '#555',
    }}>
      {message}
    </div>
  );
};

export default Loading;