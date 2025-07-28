/**
 * @file WorkspaceDetail.jsx
 * @description This file implements the WorkspaceDetail component, which displays the details of a single workspace.
 * It allows users to view workspace information, manage members, and view associated projects.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';
import Modal from '../common/Modal';

/**
 * WorkspaceDetail Component
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
  const [addMemberError, setAddMemberError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the details of a specific workspace from the backend.
     * @async
     * @function fetchWorkspaceDetails
     * @returns {Promise<void>}
     */
    const fetchWorkspaceDetails = async () => {
      try {
        const response = await api.get(`/api/workspaces/${id}`);
        setWorkspace(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [id]);

  /**
   * Handles adding a new member to the workspace.
   * @async
   * @function handleAddMember
   * @param {Event} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddMemberError(null);
    try {
      const response = await api.post(`/api/workspaces/${id}/members`, { email: newMemberEmail });
      setWorkspace(response.data.data); // Update workspace with new member list
      setNewMemberEmail('');
      setShowAddMemberModal(false);
    } catch (err) {
      setAddMemberError(err.response?.data?.message || err.message);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{workspace.name}</h1>
        <Link
          to={`/workspaces/${workspace._id}/edit`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Edit Workspace
        </Link>
      </div>

      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Details</h2>
        <p className="text-gray-700 mb-2"><strong>Description:</strong> {workspace.description}</p>
        <p className="text-gray-700 mb-2"><strong>Owner:</strong> {workspace.owner?.name || 'N/A'}</p>
        <p className="text-gray-700 mb-2"><strong>Visibility:</strong> {workspace.visibility}</p>
        <p className="text-gray-700 mb-2"><strong>Created At:</strong> {new Date(workspace.createdAt).toLocaleDateString()}</p>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Members</h2>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Add Member
          </button>
        </div>
        {workspace.members && workspace.members.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {workspace.members.map((member) => (
              <li key={member.user._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.user.email} ({member.role})</p>
                </div>
                {/* Add remove member functionality here if needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members in this workspace yet.</p>
        )}
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Projects</h2>
          <Link
            to={`/projects/new?workspaceId=${workspace._id}`}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Create New Project
          </Link>
        </div>
        {workspace.projects && workspace.projects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {workspace.projects.map((project) => (
              <li key={project._id} className="py-3">
                <Link to={`/projects/${project._id}`} className="text-blue-600 hover:underline font-medium">
                  {project.name}
                </Link>
                <p className="text-sm text-gray-500">{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No projects in this workspace yet.</p>
        )}
      </section>

      {showAddMemberModal && (
        <Modal
          title="Add New Member"
          onCancel={() => {
            setShowAddMemberModal(false);
            setNewMemberEmail('');
            setAddMemberError(null);
          }}
        >
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700">Member Email</label>
              <input
                type="email"
                id="memberEmail"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                required
              />
            </div>
            {addMemberError && <p className="text-red-500 text-sm">{addMemberError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setNewMemberEmail('');
                  setAddMemberError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Member
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WorkspaceDetail;
