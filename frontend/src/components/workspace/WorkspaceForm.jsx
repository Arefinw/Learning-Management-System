/**
 * @file WorkspaceForm.jsx
 * @description This file implements the WorkspaceForm component, used for creating and editing workspaces.
 * It handles form submission, validation, and interaction with the backend API.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

/**
 * WorkspaceForm Component
 * @param {object} props - The component props.
 * @param {boolean} [props.isEditMode=false] - Whether the form is in edit mode.
 * @returns {JSX.Element} The WorkspaceForm component.
 */
const WorkspaceForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private', // Default visibility
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id) {
      /**
       * Fetches workspace data for editing.
       * @async
       * @function fetchWorkspaceData
       * @returns {Promise<void>}
       */
      const fetchWorkspaceData = async () => {
        try {
          const response = await api.get(`/api/workspaces/${id}`);
          setFormData(response.data.data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };
      fetchWorkspaceData();
    }
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
      errors.name = 'Workspace name is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
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
        await api.put(`/api/workspaces/${id}`, formData);
        navigate(`/workspaces/${id}`);
      } else {
        const response = await api.post('/api/workspaces', formData);
        navigate(`/workspaces/${response.data.data._id}`);
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
        {isEditMode ? 'Edit Workspace' : 'Create New Workspace'}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Workspace Name</label>
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
              {loading ? 'Saving...' : (isEditMode ? 'Update Workspace' : 'Create Workspace')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceForm;
