import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

// Ant Design Components
import { Row, Col, Card, Statistic, Button, List, Avatar, Typography, Space, Spin, Alert, Divider } from 'antd';
import {
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { Title, Text } = Typography;

/**
 * Dashboard Component
 * @returns {JSX.Element} The Dashboard page.
 */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    /**
     * Fetches dashboard data from the backend.
     * @async
     * @function fetchDashboardData
     * @returns {Promise<void>}
     */
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/dashboard/stats');
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-content">
        <Spin size="large" tip="Loading Dashboard..." />
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
    <div className="p-16 bg-transparent">
        <Title level={2} style={{ marginBottom: '32px' }}>Dashboard</Title>

        {/* User Profile Section */}
        <Card
          style={{ marginBottom: '32px' }}
          title={<Title level={3} style={{ color: '#6A5ACD' }}>Welcome, {user?.name || 'User'}!</Title>}
        >
          <Row align="middle" gutter={[32, 32]}>
            <Col>
              <Avatar size={100} icon={<UserOutlined />} src={user?.avatar || "https://via.placeholder.com/100"} />
            </Col>
            <Col>
              <Text strong style={{ color: '#6A5ACD' }}>Email:</Text> <Text>{user?.email}</Text><br />
              <Text strong style={{ color: '#6A5ACD' }}>Role:</Text> <Text>{user?.role}</Text>
            </Col>
          </Row>
          <Divider style={{ margin: '24px 0' }} />
          <div style={{ marginTop: '24px' }}>
            <Link to="/profile">
              <Button type="link" style={{ color: '#6A5ACD' }}>View Profile</Button>
            </Link>
          </div>
        </Card>

        {/* Statistics/Cards Section */}
        <Row gutter={[32, 32]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Total Workspaces"
                value={dashboardData?.totalWorkspaces || 0}
                prefix={<ProjectOutlined style={{ color: '#6A5ACD' }} />}
                valueStyle={{ color: '#6A5ACD' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Total Projects"
                value={dashboardData?.totalProjects || 0}
                prefix={<ProjectOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Completed Pathways"
                value={dashboardData?.completedPathways || 0}
                prefix={<CheckCircleOutlined style={{ color: '#f093fb' }} />}
                valueStyle={{ color: '#f093fb' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Action Buttons */}
        <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Quick Actions</Title>} style={{ marginBottom: '32px' }}>
          <Space wrap size="large" style={{ gap: '16px' }}>
            <Link to="/workspaces/new">
              <Button type="primary" size="large" icon={<PlusOutlined />}>Create New Workspace</Button>
            </Link>
            <Link to="/projects/new">
              <Button type="primary" size="large" icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                Create New Project
              </Button>
            </Link>
            <Link to="/pathways/new">
              <Button type="primary" size="large" icon={<PlusOutlined />} style={{ backgroundColor: '#f093fb', borderColor: '#f093fb' }}>
                Create New Pathway
              </Button>
            </Link>
            <Link to="/search">
              <Button size="large" icon={<SearchOutlined />}>
                Search Content
              </Button>
            </Link>
          </Space>
        </Card>

        {/* Recent Activity Feed */}
        <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Recent Activity</Title>}>
          {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={dashboardData.recentActivities}
              renderItem={(activity) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#e5e7eb', color: '#4b5563' }} />}
                    title={<Text strong>{activity.description}</Text>}
                    description={<Text type="secondary">{new Date(activity.timestamp).toLocaleString()}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No recent activity to display.</Text>
          )}
        </Card>
      </div>
  );
};

export default Dashboard;
