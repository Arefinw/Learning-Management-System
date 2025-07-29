/**
 * @file WorkspaceDetail.jsx
 * @description This file implements the WorkspaceDetail component, which displays the details of a single workspace using Ant Design.
 * It allows users to view workspace information, manage members, and view associated projects.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';


// Ant Design Components
import { Layout, Row, Col, Card, Button, List, Modal, Typography, Space, Form, Input, Select } from 'antd';
import { EditOutlined, UserAddOutlined, ProjectOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

/**
 * WorkspaceDetail Component
 * @returns {JSX.Element} The WorkspaceDetail page.
 */
const WorkspaceDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberForm] = Form.useForm();

  useEffect(() => {
    /**
     * Fetches the details of a specific workspace from the backend.
     * @async
     * @function fetchWorkspaceDetails
     * @returns {Promise<void>}
     */
    const fetchWorkspaceDetails = async () => {
      try {
        const response = await api.get(`/api/workspaces/${id}`);
        setWorkspace(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [id]);

  /**
   * Handles adding a new member to the workspace.
   * @async
   * @function handleAddMember
   * @param {object} values - Form values containing email and role.
   * @returns {Promise<void>}
   */
  const handleAddMember = async (values) => {
    try {
      const response = await api.post(`/api/workspaces/${id}/members`, values);
      setWorkspace(response.data.data); // Update workspace with new member list
      addMemberForm.resetFields();
      setShowAddMemberModal(false);
      Modal.success({ content: 'Member added successfully!' });
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

  if (!workspace) {
    return <Error message="Workspace not found." />;
  }

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
          <Col>
            <Title level={2} style={{ color: '#333333' }}>{workspace.name}</Title>
          </Col>
          <Col>
            <Link to={`/workspaces/${workspace._id}/edit`}>
              <Button type="primary" icon={<EditOutlined />}>Edit Workspace</Button>
            </Link>
          </Col>
        </Row>

        <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Details</Title>} style={{ marginBottom: '32px' }}>
          <Text strong style={{ color: '#6A5ACD' }}>Description:</Text> <Text>{workspace.description}</Text><br />
          <Text strong style={{ color: '#6A5ACD' }}>Owner:</Text> <Text>{workspace.owner?.name || 'N/A'}</Text><br />
          <Text strong style={{ color: '#6A5ACD' }}>Visibility:</Text> <Text>{workspace.visibility}</Text><br />
          <Text strong style={{ color: '#6A5ACD' }}>Created At:</Text> <Text>{new Date(workspace.createdAt).toLocaleDateString()}</Text>
        </Card>

        <Card
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Members</Title>}
          extra={
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => setShowAddMemberModal(true)}>
              Add Member
            </Button>
          }
          style={{ marginBottom: '32px' }}
        >
          {workspace.members && workspace.members.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={workspace.members}
              renderItem={(member) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <List.Item.Meta
                    title={<Text strong>{member.user.name}</Text>}
                    description={<Text type="secondary">{member.user.email} ({member.role})</Text>}
                  />
                  {/* Add remove member functionality here if needed */}
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No members in this workspace yet.</Text>
          )}
        </Card>

        <Card
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Projects</Title>}
          extra={
            <Link to={`/projects/new?workspaceId=${workspace._id}`}>
              <Button type="primary" icon={<PlusOutlined />}>Create New Project</Button>
            </Link>
          }
        >
          {workspace.projects && workspace.projects.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={workspace.projects}
              renderItem={(project) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <List.Item.Meta
                    title={<Link to={`/projects/${project._id}`}><Text strong>{project.name}</Text></Link>}
                    description={<Text type="secondary">{project.description}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No projects in this workspace yet.</Text>
          )}
        </Card>

        <Modal
          title={<Title level={4} style={{ color: '#6A5ACD' }}>Add New Member</Title>}
          open={showAddMemberModal}
          onCancel={() => {
            setShowAddMemberModal(false);
            addMemberForm.resetFields();
          }}
          footer={null} // Hide default footer buttons
        >
          <Form form={addMemberForm} onFinish={handleAddMember} layout="vertical" style={{ gap: '16px' }}>
            <Form.Item
              name="email"
              label="Member Email"
              rules={[{ required: true, message: 'Please input member email!', type: 'email' }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              initialValue="member"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select size="large">
                <Option value="member">Member</Option>
                <Option value="editor">Editor</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: '0' }}>
              <Space>
                <Button onClick={() => {
                  setShowAddMemberModal(false);
                  addMemberForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Add Member
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default WorkspaceDetail;