/**
 * @file FolderDetail.jsx
 * @description This component displays the details of a single folder.
 * It fetches folder data from the backend and displays its sub-folders and pathways.
 * @module components/project/FolderDetail
 * @requires react
 * @requires react-router-dom
 * @requires ../../context/AuthContext
 * @requires ../../services/api
 * @requires ../../services/folder
 * @requires ../../services/pathway
 * @requires ../common/Loading
 * @requires ../common/Error
 * @requires antd
 * @requires @ant-design/icons
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { getFolderById, updateFolder, deleteFolder } from '../../services/folder';
import { createPathway } from '../../services/pathway';
import Loading from '../common/Loading';
import Error from '../common/Error';

// Ant Design Components
import { Layout, Row, Col, Card, Button, List, Modal, Typography, Space, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined, FolderOutlined, FileTextOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;

/**
 * @component FolderDetail
 * @description A component that displays the details of a specific folder.
 * @returns {JSX.Element} The folder detail page.
 */
const FolderDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateSubfolderModal, setShowCreateSubfolderModal] = useState(false);
  const [showCreatePathwayModal, setShowCreatePathwayModal] = useState(false);
  const [editForm] = Form.useForm();
  const [createSubfolderForm] = Form.useForm();
  const [createPathwayForm] = Form.useForm();

  useEffect(() => {
    /**
     * @function fetchFolderDetails
     * @description Fetches the details of a specific folder from the backend.
     * @returns {Promise<void>}
     */
    const fetchFolderDetails = async () => {
      try {
        const response = await getFolderById(id);
        setFolder(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchFolderDetails();
  }, [id, showEditModal, showCreateSubfolderModal, showCreatePathwayModal]); // Re-fetch when modals close

  /**
   * @function handleUpdateFolder
   * @description Handles updating the folder details.
   * @param {object} values - The form values for updating the folder.
   * @returns {Promise<void>}
   */
  const handleUpdateFolder = async (values) => {
    try {
      await updateFolder(id, values);
      Modal.success({ content: 'Folder updated successfully!' });
      setShowEditModal(false);
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * @function handleDeleteFolder
   * @description Handles deleting the folder.
   * @returns {Promise<void>}
   */
  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(id);
      Modal.success({ content: 'Folder deleted successfully!' });
      // Redirect to project detail or parent folder after deletion
      // For now, redirect to dashboard. Later, implement proper navigation.
      window.location.href = '/dashboard';
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * @function showDeleteConfirm
   * @description Shows a confirmation modal before deleting the folder.
   */
  const showDeleteConfirm = () => {
    confirm({
      title: `Do you really want to delete folder "${folder.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone and will delete all subfolders and pathways within it.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteFolder();
      },
    });
  };

  /**
   * @function handleCreateSubfolder
   * @description Handles creating a new subfolder within the current folder.
   * @param {object} values - The form values for the new subfolder.
   * @returns {Promise<void>}
   */
  const handleCreateSubfolder = async (values) => {
    try {
      await createFolder({ ...values, parentFolder: id, project: folder.project });
      Modal.success({ content: 'Subfolder created successfully!' });
      setShowCreateSubfolderModal(false);
      createSubfolderForm.resetFields();
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * @function handleCreatePathway
   * @description Handles creating a new pathway within the current folder.
   * @param {object} values - The form values for the new pathway.
   * @returns {Promise<void>}
   */
  const handleCreatePathway = async (values) => {
    try {
      await createPathway({ ...values, folder: id, project: folder.project });
      Modal.success({ content: 'Pathway created successfully!' });
      setShowCreatePathwayModal(false);
      createPathwayForm.resetFields();
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!folder) {
    return <Error message="Folder not found." />;
  }

  const isOwner = user && folder.project && folder.project.owner && user._id === folder.project.owner._id;

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
          <Col>
            <Title level={2} style={{ color: '#333333' }}>{folder.name}</Title>
          </Col>
          <Col>
            <Space>
              {isOwner && <Button type="primary" icon={<EditOutlined />} onClick={() => {
                editForm.setFieldsValue(folder);
                setShowEditModal(true);
              }}>Edit Folder</Button>}
              {isOwner && <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateSubfolderModal(true)}>Add Subfolder</Button>}
              {isOwner && <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreatePathwayModal(true)}>Add Pathway</Button>}
              {isOwner && <Button type="primary" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>Delete Folder</Button>}
            </Space>
          </Col>
        </Row>

        <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Details</Title>} style={{ marginBottom: '32px' }}>
          <Text strong style={{ color: '#6A5ACD' }}>Description:</Text> <Text>{folder.description}</Text><br />
          {folder.project && (
            <>
              <Text strong style={{ color: '#6A5ACD' }}>Project:</Text>
              <Link to={`/projects/${folder.project._id}`}><Text>{folder.project.name}</Text></Link><br />
            </>
          )}
          {folder.parentFolder && (
            <>
              <Text strong style={{ color: '#6A5ACD' }}>Parent Folder:</Text>
              <Link to={`/folders/${folder.parentFolder._id}`}><Text>{folder.parentFolder.name}</Text></Link><br />
            </>
          )}
          <Text strong style={{ color: '#6A5ACD' }}>Visibility:</Text> <Text>{folder.visibility}</Text><br />
          <Text strong style={{ color: '#6A5ACD' }}>Created At:</Text> <Text>{new Date(folder.createdAt).toLocaleDateString()}</Text>
        </Card>

        {/* Subfolders Section */}
        <Card
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Subfolders</Title>}
          style={{ marginBottom: '32px' }}
        >
          {folder.subFolders && folder.subFolders.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={folder.subFolders}
              renderItem={(subfolder) => (
                <List.Item
                  actions={[
                    <Link to={`/folders/${subfolder._id}`}><Button type="text" icon={<EyeOutlined />} style={{ color: '#4b5563' }} /></Link>,
                    isOwner && <Button type="text" icon={<EditOutlined />} onClick={() => {
                      // Implement edit subfolder logic or navigate to edit page
                    }} style={{ color: '#4b5563' }} />,
                    isOwner && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
                      // Implement delete subfolder logic
                    }} />,
                  ]}
                  style={{ padding: '16px 0' }}
                >
                  <List.Item.Meta
                    avatar={<FolderOutlined style={{ color: '#6A5ACD', fontSize: '20px' }} />}
                    title={<Link to={`/folders/${subfolder._id}`}><Text strong>{subfolder.name}</Text></Link>}
                    description={<Text type="secondary">{subfolder.description}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No subfolders in this folder yet.</Text>
          )}
        </Card>

        {/* Pathways Section */}
        <Card
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Pathways</Title>}
        >
          {folder.pathways && folder.pathways.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={folder.pathways}
              renderItem={(pathway) => (
                <List.Item
                  actions={[
                    <Link to={`/pathways/${pathway._id}`}><Button type="text" icon={<EyeOutlined />} style={{ color: '#4b5563' }} /></Link>,
                    isOwner && <Link to={`/pathways/${pathway._id}/edit`}><Button type="text" icon={<EditOutlined />} style={{ color: '#4b5563' }} /></Link>,
                    isOwner && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
                      // Implement delete pathway logic
                    }} />,
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
            <Text type="secondary">No pathways in this folder yet.</Text>
          )}
        </Card>

        {/* Edit Folder Modal */}
        <Modal
          title={<Title level={4} style={{ color: '#6A5ACD' }}>Edit Folder</Title>}
          open={showEditModal}
          onCancel={() => setShowEditModal(false)}
          footer={null}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateFolder}
          >
            <Form.Item
              name="name"
              label="Folder Name"
              rules={[{ required: true, message: 'Please input the folder name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description (Optional)"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Folder
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Subfolder Modal */}
        <Modal
          title={<Title level={4} style={{ color: '#6A5ACD' }}>Create New Subfolder</Title>}
          open={showCreateSubfolderModal}
          onCancel={() => setShowCreateSubfolderModal(false)}
          footer={null}
        >
          <Form
            form={createSubfolderForm}
            layout="vertical"
            onFinish={handleCreateSubfolder}
          >
            <Form.Item
              name="name"
              label="Subfolder Name"
              rules={[{ required: true, message: 'Please input the subfolder name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description (Optional)"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Subfolder
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Pathway Modal */}
        <Modal
          title={<Title level={4} style={{ color: '#6A5ACD' }}>Create New Pathway</Title>}
          open={showCreatePathwayModal}
          onCancel={() => setShowCreatePathwayModal(false)}
          footer={null}
        >
          <Form
            form={createPathwayForm}
            layout="vertical"
            onFinish={handleCreatePathway}
          >
            <Form.Item
              name="title"
              label="Pathway Title"
              rules={[{ required: true, message: 'Please input the pathway title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description (Optional)"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Pathway
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default FolderDetail;
