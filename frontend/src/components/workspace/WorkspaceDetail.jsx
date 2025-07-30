/**
 * @file WorkspaceDetail.jsx
 * @description This file implements the WorkspaceDetail component, which displays the details of a single workspace using basic HTML.
 * It allows users to view workspace information, manage members, and view associated projects.
 * @module components/workspace/WorkspaceDetail
 * @requires react
 * @requires react-router-dom
 * @requires ../../context/AuthContext
 * @requires ../../services/api
 * @requires ../common/Loading
 * @requires ../common/Error
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

/**
 * @component WorkspaceDetail
 * @description A component that displays the details of a specific workspace.
 * @returns {JSX.Element} The WorkspaceDetail page.
 */
const WorkspaceDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');

  useEffect(() => {
    /**
     * @function fetchWorkspaceDetails
     * @description Fetches the details of a specific workspace from the backend.
     * @returns {Promise<void>}
     */
    const fetchWorkspaceDetails = async () => {

      console.log('WorkspaceDetail: Attempting to fetch workspace details for ID:', id); // Added log

      try {
        console.log("fetching workspace details", id);
        const response = await api.get(`/api/workspaces/${id}`);

        console.log("response", response);
        setWorkspace(response.data.data);
        setLoading(false);
        console.log('WorkspaceDetail: Successfully fetched workspace details.'); // Added log
      } catch (err) {
        console.error('WorkspaceDetail: Error fetching workspace details:', err.response?.data || err.message); // Added log
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [id]);

  /**
   * @function handleAddMember
   * @description Handles adding a new member to the workspace.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object from the form submission.
   * @returns {Promise<void>}
   */
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/workspaces/${id}/members`, { email: newMemberEmail, role: newMemberRole });
      setWorkspace(response.data.data); // Update workspace with new member list
      setNewMemberEmail('');
      setNewMemberRole('member');
      setShowAddMemberModal(false);
      alert('Member added successfully!');
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!workspace) {
    return <Error message="Workspace not found." />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333333' }}>{workspace.name}</h2>
        <Link to={`/workspaces/${workspace._id}/edit`}>
          <button style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Edit Workspace
          </button>
        </Link>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '20px' }}>
        <h3 style={{ color: '#6A5ACD', marginBottom: '10px' }}>Details</h3>
        <p><strong>Description:</strong> {workspace.description}</p>
        <p><strong>Owner:</strong> {workspace.owner?.name || 'N/A'}</p>
        <p><strong>Visibility:</strong> {workspace.visibility}</p>
        <p><strong>Created At:</strong> {new Date(workspace.createdAt).toLocaleDateString()}</p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ color: '#6A5ACD' }}>Members</h3>
          <button
            onClick={() => setShowAddMemberModal(true)}
            style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Add Member
          </button>
        </div>
        {workspace.members && workspace.members.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {workspace.members.map((member) => (
              <li key={member.user._id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>{member.user.name}</strong> ({member.user.email}) - {member.role}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#6b7280' }}>No members in this workspace yet.</p>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ color: '#6A5ACD' }}>Projects</h3>
          <Link to={`/projects/new?workspaceId=${workspace._id}`}>
            <button style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Create New Project
            </button>
          </Link>
        </div>
        {workspace.projects && workspace.projects.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {workspace.projects.map((project) => (
              <li key={project._id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  <strong>{project.name}</strong>
                </Link>
                <p style={{ margin: '5px 0 0 0', color: '#555' }}>{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#6b7280' }}>No projects in this workspace yet.</p>
        )}
      </div>

      {showAddMemberModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            width: '400px',
            textAlign: 'left',
          }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>Add New Member</h4>
            <form onSubmit={handleAddMember}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="memberEmail" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Member Email</label>
                <input
                  type="email"
                  id="memberEmail"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="memberRole" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role</label>
                <select
                  id="memberRole"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                >
                  <option value="member">Member</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetail;