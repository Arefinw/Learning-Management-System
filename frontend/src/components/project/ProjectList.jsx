/**
 * @file ProjectList.jsx
 * @description This file implements the ProjectList component, which displays a list of projects using basic HTML.
 * It allows users to view, create, edit, and delete projects.
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

/**
 * ProjectList Component
 * @returns {JSX.Element} The ProjectList page.
 */
const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
          url = `/api/workspaces/${workspaceId}/projects`;
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
      alert('Project deleted successfully!'); // Replaced Ant Design Modal
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`); // Replaced Ant Design Modal
    }
  };

  /**
   * Shows the delete confirmation modal.
   * @function showDeleteModal
   * @param {object} project - The project object to delete.
   * @returns {void}
   */
  const showDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333333' }}>Projects {workspaceId && `for Workspace ${workspaceId}`}</h2>
        <Link to={workspaceId ? `/projects/new?workspaceId=${workspaceId}` : "/projects/new"}>
          <button style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Create New Project
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
          <p style={{ color: '#6b7280' }}>No projects found. Create one to get started!</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Owner</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Workspace</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Visibility</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((record) => (
              <tr key={record._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}><Link to={`/projects/${record._id}`}>{record.name}</Link></td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.description}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.owner?.name || 'N/A'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.workspace ? <Link to={`/workspaces/${record.workspace._id}`}>{record.workspace.name}</Link> : 'N/A'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    backgroundColor: record.visibility === 'private' ? '#ffeded' : record.visibility === 'public' ? '#edfff1' : '#f0f8ff',
                    color: record.visibility === 'private' ? '#d32f2f' : record.visibility === 'public' ? '#2e7d32' : '#1976d2',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '0.8em',
                  }}>
                    {record.visibility.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/projects/${record._id}/edit`}>
                      <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                    </Link>
                    <button
                      onClick={() => showDeleteModal(record)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDeleteConfirm && (
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
            textAlign: 'center',
          }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>Confirm Delete</h4>
            <p style={{ color: '#374151', marginBottom: '20px' }}>Are you sure you want to delete the project "<span style={{ fontWeight: 'bold' }}>{projectToDelete?.name}</span>"? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => handleDelete(projectToDelete._id)}
                style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;