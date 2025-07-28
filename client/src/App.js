import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';

/**
 * @description Main application component. Renders the application routes.
 * @returns {JSX.Element} - The main application component.
 */
function App() {
  return (
    <div className="App">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;
