/**
 * @file ProjectDetail.jsx
 * @description This file implements the ProjectDetail component, which displays the details of a single project using Ant Design.
 * It allows users to view project information, manage folders and pathways within the project.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';


// Ant Design Components
import { Layout, Row, Col, Card, Button, List, Modal, Typography, Space } from 'antd';
import { EditOutlined, PlusOutlined, FolderOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      await api.delete(`/api/projects/${id}/${itemType}s/${itemId}`);
      // Update project state to remove the deleted item
      setProject((prevProject) => ({
        ...prevProject,
        [itemType + 's']: prevProject[itemType + 's'].filter((item) => item._id !== itemId),
      }));
      Modal.success({ content: `${itemType} deleted successfully!` });
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setItemTypeToDelete(null);
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * Shows the delete confirmation modal for a folder or pathway.
   * @function showDeleteModal
   * @param {object} item - The item object to delete.
   * @param {string} type - The type of the item (e.g., 'folder' or 'pathway').
   * @returns {void}
   */
  const showDeleteModal = (item, type) => {
    setItemToDelete(item);
    setItemTypeToDelete(type);
    setShowDeleteConfirm(true);
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
    <Layout className="p-16 bg-transparent">
      <Content>
        <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
          <Col>
            <Title level={2} style={{ color: '#333333' }}>{project.name}</Title>
          </Col>
          <Col>
            <Link to={`/projects/${project._id}/edit`}>
              <Button type="primary" icon={<EditOutlined />}>Edit Project</Button>
            </Link>
          </Col>
        </Row>

        <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Details</Title>} style={{ marginBottom: '32px' }}>
          <Text strong style={{ color: '#6A5ACD' }}>Description:</Text> <Text>{project.description}</Text><br />
          <Text strong style={{ color: '#6A5ACD' }}>Owner:</Text> <Text>{project.owner?.name || 'N/A'}</Text><br />
          <Text strong style={{ color: '#6A5ACD' }}>Visibility:</Text> <Text>{project.visibility}</Text><br />
          {project.workspace && (
            <>
              <Text strong style={{ color: '#6A5ACD' }}>Workspace:</Text>
              <Link to={`/workspaces/${project.workspace._id}`}><Text>{project.workspace.name}</Text></Link><br />
            </>
          )}
          <Text strong style={{ color: '#6A5ACD' }}>Created At:</Text> <Text>{new Date(project.createdAt).toLocaleDateString()}</Text>
        </Card>

        {/* Folders Section */}
        <Card
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Folders</Title>}
          extra={
            <Link to={`/projects/${project._id}/folders/new`}>
              <Button type="primary" icon={<PlusOutlined />}>Create New Folder</Button>
            </Link>
          }
          style={{ marginBottom: '32px' }}
        >
          {project.folders && project.folders.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={project.folders}
              renderItem={(folder) => (
                <List.Item
                  actions={[
                    <Link to={`/folders/${folder._id}/edit`}><Button type="text" icon={<EditOutlined />} style={{ color: '#4b5563' }} /></Link>,
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteModal(folder, 'folder')} />,
                  ]}
                  style={{ padding: '16px 0' }}
                >
                  <List.Item.Meta
                    avatar={<FolderOutlined style={{ color: '#6A5ACD', fontSize: '20px' }} />}
                    title={<Link to={`/folders/${folder._id}`}><Text strong>{folder.name}</Text></Link>}
                    description={<Text type="secondary">{folder.description}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No folders in this project yet.</Text>
          )}
        </Card>

        {/* Pathways Section */}
        <Card
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Pathways</Title>}
          extra={
            <Link to={`/projects/${project._id}/pathways/new`}>
              <Button type="primary" icon={<PlusOutlined />}>Create New Pathway</Button>
            </Link>
          }
        >
          {project.pathways && project.pathways.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={project.pathways}
              renderItem={(pathway) => (
                <List.Item
                  actions={[
                    <Link to={`/pathways/${pathway._id}/edit`}><Button type="text" icon={<EditOutlined />} style={{ color: '#4b5563' }} /></Link>,
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteModal(pathway, 'pathway')} />,
                  ]}
                  style={{ padding: '16px 0' }}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ color: '#6A5ACD', fontSize: '20px' }} />}
                    title={<Link to={`/pathways/${pathway._id}`}><Text strong>{pathway.title}</Text></Link>}
                    description={<Text type="secondary">{pathway.description}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No pathways in this project yet.</Text>
          )}
        </Card>

        <Modal
          title={<Title level={4} style={{ color: '#6A5ACD' }}>Confirm Delete</Title>}
          open={showDeleteConfirm}
          onOk={() => handleDeleteItem(itemToDelete._id, itemTypeToDelete)}
          onCancel={() => setShowDeleteConfirm(false)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p style={{ color: '#374151' }}>Are you sure you want to delete the {itemTypeToDelete} "<Text strong>{itemToDelete?.name || itemToDelete?.title}</Text>"? This action cannot be undone.</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ProjectDetail;
