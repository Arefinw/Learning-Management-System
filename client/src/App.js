import React from 'react';
import AppRoutes from './routes/AppRoutes';

/**
 * @description Main application component. Renders the application routes.
 * @returns {JSX.Element} - The main application component.
 */
function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
