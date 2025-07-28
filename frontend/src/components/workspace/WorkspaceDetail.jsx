import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WorkspaceDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/workspaces/${id}`)
        .then((res) => {
          setWorkspace(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/workspaces/${id}/members`, {
        email: newMemberEmail,
        role: newMemberRole,
      });
      setWorkspace({ ...workspace, members: res.data });
      setNewMemberEmail('');
      setNewMemberRole('viewer');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleVisibilityChange = async (e) => {
    try {
      const res = await axios.put(`/api/workspaces/${id}`, {
        visibility: e.target.value,
      });
      setWorkspace(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (!workspace) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">{workspace.name}</h2>
      <p>{workspace.description}</p>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Members</h3>
        <ul>
          {workspace.members.map((member) => (
            <li key={member.user._id}>
              {member.user.email} - {member.role}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddMember} className="mt-2">
          <input
            type="email"
            placeholder="Member Email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="border p-2 mr-2"
            required
          />
          <select
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Member
          </button>
        </form>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Visibility</h3>
        <select
          value={workspace.visibility}
          onChange={handleVisibilityChange}
          className="border p-2"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="workspace">Workspace</option>
        </select>
      </div>
    </div>
  );
};

export default WorkspaceDetail;