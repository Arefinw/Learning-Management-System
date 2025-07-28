import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
};

export default Dashboard;
