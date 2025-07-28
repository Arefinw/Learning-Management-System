/**
 * @file ProjectList.jsx
 * @description This file implements the ProjectList component, which displays a list of projects.
 * It allows users to view, create, edit, and delete projects.
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';
import Modal from '../common/Modal';

/**
 * ProjectList Component
 * @returns {JSX.Element} The ProjectList page.
 */
const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workspaceId = queryParams.get('workspaceId');

  useEffect(() => {
    /**
     * Fetches the list of projects from the backend.
     * If a workspaceId is present in the URL, it fetches projects for that specific workspace.
     * @async
     * @function fetchProjects
     * @returns {Promise<void>}
     */
    const fetchProjects = async () => {
      try {
        let url = '/api/projects';
        if (workspaceId) {
          url = `/api/workspaces/${workspaceId}/projects`; // Assuming this endpoint exists or will be created
        }
        const response = await api.get(url);
        setProjects(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [workspaceId]);

  /**
   * Handles the deletion of a project.
   * @async
   * @function handleDelete
   * @param {string} id - The ID of the project to delete.
   * @returns {Promise<void>}
   */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * Opens the delete confirmation modal.
   * @function confirmDelete
   * @param {object} project - The project object to delete.
   * @returns {void}
   */
  const confirmDelete = (project) => {
    setProjectToDelete(project);
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
        <h1 className="text-3xl font-bold text-gray-800">Projects {workspaceId && `for Workspace ${workspaceId}`}</h1>
        <Link
          to={workspaceId ? `/projects/new?workspaceId=${workspaceId}` : "/projects/new"}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No projects found. Create one to get started!</p>
          {/* You can add an illustration here */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <p className="text-sm text-gray-500">Owner: {project.owner?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Visibility: {project.visibility}</p>
                {project.workspace && (
                  <p className="text-sm text-gray-500">Workspace: {project.workspace.name || project.workspace}</p>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/projects/${project._id}`}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                >
                  View
                </Link>
                <Link
                  to={`/projects/${project._id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => confirmDelete(project)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && projectToDelete && (
        <Modal
          title="Confirm Delete"
          message={`Are you sure you want to delete the project "${projectToDelete.name}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(projectToDelete._id)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectList;