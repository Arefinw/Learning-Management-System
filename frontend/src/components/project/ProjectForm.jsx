/**
 * @file ProjectForm.jsx
 * @description This file implements the ProjectForm component, used for creating and editing projects.
 * It handles form submission, validation, and interaction with the backend API.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

/**
 * ProjectForm Component
 * @param {object} props - The component props.
 * @param {boolean} [props.isEditMode=false] - Whether the form is in edit mode.
 * @returns {JSX.Element} The ProjectForm component.
 */
const ProjectForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workspaceIdFromUrl = queryParams.get('workspaceId');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private', // Default visibility
    workspace: workspaceIdFromUrl || '',
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [workspaces, setWorkspaces] = useState([]); // To populate workspace dropdown

  useEffect(() => {
    /**
     * Fetches workspaces for the dropdown and project data if in edit mode.
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      try {
        // Fetch workspaces for dropdown
        const workspacesResponse = await api.get('/api/workspaces');
        setWorkspaces(workspacesResponse.data.data);

        if (isEditMode && id) {
          const projectResponse = await api.get(`/api/projects/${id}`);
          setFormData(projectResponse.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [isEditMode, id]);

  /**
   * Handles input changes in the form.
   * @function handleChange
   * @param {object} e - The event object.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: null }); // Clear error on change
  };

  /**
   * Validates the form data.
   * @function validateForm
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Project name is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }
    if (!formData.workspace) {
      errors.workspace = 'Workspace is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles form submission.
   * @async
   * @function handleSubmit
   * @param {object} e - The event object.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isEditMode) {
        await api.put(`/api/projects/${id}`, formData);
        navigate(`/projects/${id}`);
      } else {
        const response = await api.post('/api/projects', formData);
        navigate(`/projects/${response.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Project' : 'Create New Project'}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`mt-1 block w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            ></textarea>
            {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
          </div>

          <div>
            <label htmlFor="workspace" className="block text-sm font-medium text-gray-700">Workspace</label>
            <select
              id="workspace"
              name="workspace"
              value={formData.workspace}
              onChange={handleChange}
              className={`mt-1 block w-full border ${formErrors.workspace ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            >
              <option value="">Select a Workspace</option>
              {workspaces.map((ws) => (
                <option key={ws._id} value={ws._id}>
                  {ws.name}
                </option>
              ))}
            </select>
            {formErrors.workspace && <p className="mt-1 text-sm text-red-500">{formErrors.workspace}</p>}
          </div>

          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">Visibility</label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="workspace">Workspace Members Only</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
