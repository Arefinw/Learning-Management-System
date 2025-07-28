import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    // Fetch users
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    // Fetch workspaces
    axios.get('/api/workspaces')
      .then(res => setWorkspaces(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div className="card">
          <h3 className="text-xl font-medium mb-2">All Users</h3>
          <ul>
            {users.map(user => (
              <li key={user._id} className="py-2 border-b border-neutral-border last:border-b-0 flex justify-between items-center">
                <span>{user.name} ({user.email}) - {user.role}</span>
                <button className="btn btn-secondary btn-sm">Edit</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Workspace Management</h2>
        <div className="card">
          <h3 className="text-xl font-medium mb-2">All Workspaces</h3>
          <ul>
            {workspaces.map(workspace => (
              <li key={workspace._id} className="py-2 border-b border-neutral-border last:border-b-0 flex justify-between items-center">
                <span>{workspace.name} ({workspace.description})</span>
                <button className="btn btn-secondary btn-sm">Edit</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Content Moderation</h2>
        <div className="card">
          <p>Content moderation tools will be available here.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Analytics and Reporting</h2>
        <div className="card">
          <p>Analytics and reporting dashboards will be displayed here.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">System Settings</h2>
        <div className="card">
          <p>System-wide configurations and settings will be managed here.</p>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;