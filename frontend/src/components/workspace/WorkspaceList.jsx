import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const WorkspaceList = () => {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get('/api/workspaces')
        .then((res) => {
          setWorkspaces(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-bold">My Workspaces</h2>
      <ul>
        {workspaces.map((workspace) => (
          <li key={workspace._id}>{workspace.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkspaceList;
