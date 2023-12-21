import React from 'react';

const ErrorComponent: React.FC<{ errorMessage: string }> = ({ errorMessage }) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorComponent;
