import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4 shadow-md hidden md:block">
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="text-blue-700 hover:text-blue-900 font-medium">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/workspaces" className="text-blue-700 hover:text-blue-900 font-medium">Workspaces</Link>
          </li>
          <li className="mb-2">
            <Link to="/projects" className="text-blue-700 hover:text-blue-900 font-medium">Projects</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
