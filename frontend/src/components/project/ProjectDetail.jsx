/**
 * @file ProjectDetail.jsx
 * @description This file implements the ProjectDetail component, which displays the details of a single project.
 * It allows users to view project information, manage folders and pathways within the project.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';
import Modal from '../common/Modal';

/**
 * ProjectDetail Component
 * @returns {JSX.Element} The ProjectDetail page.
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemTypeToDelete, setItemTypeToDelete] = useState(null);

  useEffect(() => {
    /**
     * Fetches the details of a specific project from the backend.
     * @async
     * @function fetchProjectDetails
     * @returns {Promise<void>}
     */
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get(`/api/projects/${id}`);
        setProject(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  /**
   * Handles the deletion of a folder or pathway within the project.
   * @async
   * @function handleDeleteItem
   * @param {string} itemId - The ID of the item to delete.
   * @param {string} itemType - The type of the item (e.g., 'folder' or 'pathway').
   * @returns {Promise<void>}
   */
  const handleDeleteItem = async (itemId, itemType) => {
    try {
      // Assuming API endpoints for deleting folders/pathways within a project
      await api.delete(`/api/projects/${id}/${itemType}s/${itemId}`);
      // Update project state to remove the deleted item
      setProject((prevProject) => ({
        ...prevProject,
        [itemType + 's']: prevProject[itemType + 's'].filter((item) => item._id !== itemId),
      }));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setItemTypeToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * Opens the delete confirmation modal for a folder or pathway.
   * @function confirmDeleteItem
   * @param {object} item - The item object to delete.
   * @param {string} type - The type of the item (e.g., 'folder' or 'pathway').
   * @returns {void}
   */
  const confirmDeleteItem = (item, type) => {
    setItemToDelete(item);
    setItemTypeToDelete(type);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!project) {
    return <Error message="Project not found." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
        <Link
          to={`/projects/${project._id}/edit`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Edit Project
        </Link>
      </div>

      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Details</h2>
        <p className="text-gray-700 mb-2"><strong>Description:</strong> {project.description}</p>
        <p className="text-gray-700 mb-2"><strong>Owner:</strong> {project.owner?.name || 'N/A'}</p>
        <p className="text-gray-700 mb-2"><strong>Visibility:</strong> {project.visibility}</p>
        {project.workspace && (
          <p className="text-gray-700 mb-2">
            <strong>Workspace:</strong>
            <Link to={`/workspaces/${project.workspace._id}`} className="text-blue-600 hover:underline ml-1">
              {project.workspace.name}
            </Link>
          </p>
        )}
        <p className="text-gray-700 mb-2"><strong>Created At:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
      </section>

      {/* Folders Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Folders</h2>
          <Link
            to={`/projects/${project._id}/folders/new`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Create New Folder
          </Link>
        </div>
        {project.folders && project.folders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {project.folders.map((folder) => (
              <li key={folder._id} className="py-3 flex justify-between items-center">
                <div>
                  <Link to={`/folders/${folder._id}`} className="text-blue-600 hover:underline font-medium">
                    {folder.name}
                  </Link>
                  <p className="text-sm text-gray-500">{folder.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/folders/${folder._id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => confirmDeleteItem(folder, 'folder')}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No folders in this project yet.</p>
        )}
      </section>

      {/* Pathways Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Pathways</h2>
          <Link
            to={`/projects/${project._id}/pathways/new`}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Create New Pathway
          </Link>
        </div>
        {project.pathways && project.pathways.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {project.pathways.map((pathway) => (
              <li key={pathway._id} className="py-3 flex justify-between items-center">
                <div>
                  <Link to={`/pathways/${pathway._id}`} className="text-blue-600 hover:underline font-medium">
                    {pathway.title}
                  </Link>
                  <p className="text-sm text-gray-500">{pathway.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/pathways/${pathway._id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => confirmDeleteItem(pathway, 'pathway')}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 rounded-md transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No pathways in this project yet.</p>
        )}
      </section>

      {showDeleteModal && itemToDelete && (
        <Modal
          title="Confirm Delete"
          message={`Are you sure you want to delete the ${itemTypeToDelete} "${itemToDelete.name || itemToDelete.title}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteItem(itemToDelete._id, itemTypeToDelete)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;