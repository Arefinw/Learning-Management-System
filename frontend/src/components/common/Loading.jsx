/**
 * @file Loading.jsx
 * @description This component displays a simple loading message.
 * It is used to indicate that data is being fetched or a process is running.
 * @module components/common/Loading
 * @requires react
 */

import React from 'react';

/**
 * @component Loading
 * @description A simple component to display a loading message.
 * @param {object} props - The component props.
 * @param {string} [props.message="Loading..."] - The loading message to display.
 * @returns {JSX.Element} The loading message component.
 */
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
