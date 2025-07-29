import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

// Ant Design Components
import { Layout, Row, Col, Card, Button, List, Modal, Typography, Space, Spin, Alert, Empty } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;

/**
 * WorkspaceList Component
 * @returns {JSX.Element} The WorkspaceList page.
 */
const WorkspaceList = () => {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("data fetched", response.data.data);
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
      Modal.success({ content: 'Workspace deleted successfully!' });
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * Shows the delete confirmation modal.
   * @function showDeleteConfirm
   * @param {object} workspace - The workspace object to delete.
   * @returns {void}
   */
  const showDeleteConfirmModal = (workspace) => {
    confirm({
      title: `Do you really want to delete workspace "${workspace.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(workspace._id);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-content">
        <Spin size="large" tip="Loading Workspaces..." />
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

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
          <Col>
            <Title level={2} style={{ color: '#333333' }}>Workspaces</Title>
          </Col>
          <Col>
            <Link to="/workspaces/new">
              <Button type="primary" size="large" icon={<PlusOutlined />}>Create New Workspace</Button>
            </Link>
          </Col>
        </Row>

        {workspaces.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ color: '#6b7280' }}>No workspaces found. Create one to get started!</Text>
            }
          />
        ) : (
          <Row gutter={[32, 32]}>
            {workspaces.map((workspace) => (
              <Col key={workspace._id} xs={24} sm={12} lg={8}>
                <Card
                  title={<Title level={4} style={{ color: '#6A5ACD' }}>{workspace.name}</Title>}
                  extra={
                    <Space>
                      <Link to={`/workspaces/${workspace._id}`}>
                        <Button type="text" icon={<EyeOutlined />} style={{ color: '#4b5563' }} />
                      </Link>
                      <Link to={`/workspaces/${workspace._id}/edit`}>
                        <Button type="text" icon={<EditOutlined />} style={{ color: '#4b5563' }} />
                      </Link>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirmModal(workspace)} />
                    </Space>
                  }
                >
                  <Text style={{ color: '#374151' }}>{workspace.description}</Text><br />
                  <Text style={{ color: '#4b5563' }} className="caption">Owner: {workspace.owner?.name || 'N/A'}</Text><br />
                  <Text style={{ color: '#4b5563' }} className="caption">Visibility: {workspace.visibility}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default WorkspaceList;
