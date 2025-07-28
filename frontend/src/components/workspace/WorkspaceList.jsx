/**
 * @file WorkspaceList.jsx
 * @description This file implements the WorkspaceList component, which displays a list of workspaces.
 * It allows users to view, create, edit, and delete workspaces.
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';
import Modal from '../common/Modal';

/**
 * WorkspaceList Component
 * @returns {JSX.Element} The WorkspaceList page.
 */
const WorkspaceList = () => {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  useEffect(() => {
    /**
     * Fetches the list of workspaces from the backend.
     * @async
     * @function fetchWorkspaces
     * @returns {Promise<void>}
     */
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get('/api/workspaces');
        setWorkspaces(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  /**
   * Handles the deletion of a workspace.
   * @async
   * @function handleDelete
   * @param {string} id - The ID of the workspace to delete.
   * @returns {Promise<void>}
   */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/workspaces/${id}`);
      setWorkspaces(workspaces.filter((workspace) => workspace._id !== id));
      setShowDeleteModal(false);
      setWorkspaceToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * Opens the delete confirmation modal.
   * @function confirmDelete
   * @param {object} workspace - The workspace object to delete.
   * @returns {void}
   */
  const confirmDelete = (workspace) => {
    setWorkspaceToDelete(workspace);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Workspaces</h1>
        <Link
          to="/workspaces/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Create New Workspace
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No workspaces found. Create one to get started!</p>
          {/* You can add an illustration here */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div key={workspace._id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{workspace.name}</h2>
                <p className="text-gray-600 mb-4">{workspace.description}</p>
                <p className="text-sm text-gray-500">Owner: {workspace.owner?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Visibility: {workspace.visibility}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/workspaces/${workspace._id}`}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                >
                  View
                </Link>
                <Link
                  to={`/workspaces/${workspace._id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => confirmDelete(workspace)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && workspaceToDelete && (
        <Modal
          title="Confirm Delete"
          message={`Are you sure you want to delete the workspace "${workspaceToDelete.name}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(workspaceToDelete._id)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default WorkspaceList;