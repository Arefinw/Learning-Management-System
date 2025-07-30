/**
 * @file ProjectList.jsx
 * @description This file implements the ProjectList component, which displays a list of projects using basic HTML.
 * It allows users to view, create, edit, and delete projects.
 * @module components/project/ProjectList
 * @requires react
 * @requires react-router-dom
 * @requires ../../context/AuthContext
 * @requires ../../services/api
 * @requires ../common/Loading
 * @requires ../common/Error
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Layout, Row, Col, Card, Button, List, Modal, Typography, Space, Table, Tag, Empty, Alert, Spin } from 'antd';
const { Title, Text } = Typography;
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

/**
 * @component ProjectList
 * @description A component that displays a list of projects.
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
     * @function fetchProjects
     * @description Fetches the list of projects from the backend.
     * If a workspaceId is present in the URL, it fetches projects for that specific workspace.
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
   * @function handleDelete
   * @description Handles the deletion of a project.
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
   * @function showDeleteModal
   * @description Shows the delete confirmation modal.
   * @param {object} project - The project object to delete.
   */
  const showDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-content">
        <Spin size="large" tip="Loading Projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
        />
      </div>
    );
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/projects/${record._id}`}>{text}</Link>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Owner',
      dataIndex: ['owner', 'name'],
      key: 'owner',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Workspace',
      dataIndex: ['workspace', 'name'],
      key: 'workspace',
      render: (text, record) => record.workspace ? <Link to={`/workspaces/${record.workspace._id}`}>{text}</Link> : 'N/A',
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      render: (visibility) => (
        <Tag color={visibility === 'private' ? 'red' : visibility === 'public' ? 'green' : 'blue'}>
          {visibility.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/projects/${record._id}/edit`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirmModal(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Layout className="p-16 bg-transparent">
      <Layout.Content>
        <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
          <Col>
            <Title level={2} style={{ color: '#333333' }}>Projects {workspaceId && `for Workspace ${workspaceId}`}</Title>
          </Col>
          <Col>
            <Link to={workspaceId ? `/projects/new?workspaceId=${workspaceId}` : "/projects/new"}>
              <Button type="primary" size="large" icon={<PlusOutlined />}>Create New Project</Button>
            </Link>
          </Col>
        </Row>

        {projects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ color: '#6b7280' }}>No projects found. Create one to get started!</Text>
            }
          />
        ) : (
          <Table columns={columns} dataSource={projects} rowKey="_id" pagination={{ pageSize: 10 }} />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default ProjectList;
