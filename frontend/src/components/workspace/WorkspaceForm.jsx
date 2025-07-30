/**
 * @file WorkspaceForm.jsx
 * @description This file implements the WorkspaceForm component, used for creating and editing workspaces using basic HTML.
 * It handles form submission, validation, and interaction with the backend API.
 * @module components/workspace/WorkspaceForm
 * @requires react
 * @requires react-router-dom
 * @requires ../../services/api
 * @requires ../common/Loading
 * @requires ../common/Error
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

/**
 * @component WorkspaceForm
 * @description A form for creating and editing workspaces.
 * @param {object} props - The component props.
 * @param {boolean} [props.isEditMode=false] - Whether the form is in edit mode.
 * @returns {JSX.Element} The WorkspaceForm component.
 */
const WorkspaceForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode && id) {
      /**
       * @function fetchWorkspaceData
       * @description Fetches workspace data for editing.
       * @returns {Promise<void>}
       */
      const fetchWorkspaceData = async () => {
        try {
          const response = await api.get(`/api/workspaces/${id}`);
          setName(response.data.data.name);
          setDescription(response.data.data.description);
          setVisibility(response.data.data.visibility);
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
   * @function handleSubmit
   * @description Handles form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const values = { name, description, visibility };
    try {
      if (isEditMode) {
        console.log('WorkspaceForm: Attempting to update workspace with ID:', id);
        await api.put(`/api/workspaces/${id}`, values);
        alert('Workspace updated successfully!');
        navigate(`/workspaces/${id}`);
      } else {
        console.log('WorkspaceForm: Attempting to create new workspace', values);
        const response = await api.post('/api/workspaces', values);
        console.log('WorkspaceForm: Workspace created successfully, navigating to:', `/workspaces/${response.data.data._id}`);
        alert('Workspace created successfully!');
        navigate(`/workspaces/${response.data.data._id}`);
      }
    } catch (err) {
      console.error('WorkspaceForm: Error during form submission:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      alert(`Error: ${err.response?.data?.message || err.message}`);
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333333', marginBottom: '20px' }}>{isEditMode ? 'Edit Workspace' : 'Create New Workspace'}</h2>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Workspace Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="visibility" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Visibility</label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="workspace">Workspace Members Only</option>
            </select>
          </div>

          <button
            type="submit"
            style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            disabled={loading}
          >
            {isEditMode ? 'Update Workspace' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceForm;