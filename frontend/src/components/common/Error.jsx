import React from 'react';

const Error = ({ message }) => {
  return (
    <div className="alert alert-error" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
};

export default Error;
