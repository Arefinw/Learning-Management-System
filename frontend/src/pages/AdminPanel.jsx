/**
 * @file AdminPanel.jsx
 * @description This component provides an admin panel for managing users and workspaces.
 * It fetches and displays lists of users and workspaces.
 * @module pages/AdminPanel
 * @requires react
 * @requires ../services/api
 * @requires ../components/common/Loading
 * @requires ../components/common/Error
 * @requires antd
 * @requires @ant-design/icons
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';

// Ant Design Components
import { Layout, Row, Col, Card, Button, List, Typography, Space, Spin, Alert } from 'antd';
import { EditOutlined, UserOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * @component AdminPanel
 * @description A component that provides an admin panel for managing the application.
 * @returns {JSX.Element} The admin panel page.
 */
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * @function fetchData
     * @description Fetches all users and workspaces for the admin panel.
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      try {
        const [usersRes, workspacesRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/workspaces'),
        ]);
        setUsers(usersRes.data.data);
        setWorkspaces(workspacesRes.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-content">
        <Spin size="large" tip="Loading Admin Panel..." />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Title level={2} style={{ color: '#333333', marginBottom: '32px' }}>Admin Panel</Title>

        <section style={{ marginBottom: '32px' }}>
          <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>User Management</Title>}>
            <Table
              dataSource={users}
              rowKey="_id"
              columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                {
                  title: 'Role',
                  dataIndex: 'role',
                  key: 'role',
                  render: (text, record) => (
                    <Select
                      defaultValue={text}
                      style={{ width: 120 }}
                      onChange={(value) => handleUpdateUserRole(record._id, value)}
                    >
                      <Option value="user">User</Option>
                      <Option value="admin">Admin</Option>
                    </Select>
                  ),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <Space size="middle">
                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => handleDeleteUser(record._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Workspace Management</Title>}>
            <List
              itemLayout="horizontal"
              dataSource={workspaces}
              renderItem={(workspace) => (
                <List.Item
                  actions={[
                    <Button type="text" icon={<EditOutlined />} style={{ color: '#4b5563' }} />,
                  ]}
                  style={{ padding: '16px 0' }}
                >
                  <List.Item.Meta
                    avatar={<TeamOutlined style={{ color: '#6A5ACD', fontSize: '20px' }} />}
                    title={<Text strong>{workspace.name}</Text>}
                    description={<Text type="secondary">{workspace.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Content Moderation</Title>}>
            <Text style={{ color: '#374151' }}>Content moderation tools will be available here.</Text>
          </Card>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Analytics and Reporting</Title>}>
            <Text style={{ color: '#374151' }}>Analytics and reporting dashboards will be displayed here.</Text>
          </Card>
        </section>

        <section>
          <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>System Settings</Title>}>
            <Text style={{ color: '#374151' }}>System-wide configurations and settings will be managed here.</Text>
          </Card>
        </section>
      </Content>
    </Layout>
  );
};

export default AdminPanel;
