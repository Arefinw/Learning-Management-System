/**
 * @file PathwayList.jsx
 * @description This component displays a list of pathways.
 * It can display all pathways or pathways for a specific project.
 * @module components/pathway/PathwayList
 * @requires react
 * @requires react-router-dom
 * @requires ../../context/AuthContext
 * @requires ../../services/api
 * @requires ../common/Loading
 * @requires ../common/Error
 * @requires antd
 * @requires @ant-design/icons
 */

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';
import { Link } from 'react-router-dom';

// Ant Design Components
import { Layout, Card, Typography, List, Empty, Spin, Alert, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * @component PathwayList
 * @description A component that displays a list of pathways.
 * @param {object} props - The component props.
 * @param {string} [props.projectId] - The ID of the project to filter pathways by.
 * @returns {JSX.Element} The pathway list page.
 */
const PathwayList = ({ projectId }) => {
  const { user } = useContext(AuthContext);
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * @function fetchPathways
     * @description Fetches the list of pathways from the backend.
     * @returns {Promise<void>}
     */
    const fetchPathways = async () => {
      try {
        const url = projectId ? `/api/pathways?project=${projectId}` : '/api/pathways';
        const response = await api.get(url);
        setPathways(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchPathways();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-content">
        <Spin size="large" tip="Loading Pathways..." />
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
            <Title level={2} style={{ color: '#333333' }}>Pathways {projectId && `for Project ${projectId}`}</Title>
          </Col>
          <Col>
            <Link to={projectId ? `/pathways/new?projectId=${projectId}` : "/pathways/new"}>
              <Button type="primary" size="large" icon={<PlusOutlined />}>Create New Pathway</Button>
            </Link>
          </Col>
        </Row>

        {pathways.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ color: '#6b7280' }}>No pathways found. Create one to get started!</Text>
            }
          />
        ) : (
          <Card>
            <List
              itemLayout="horizontal"
              dataSource={pathways}
              renderItem={(pathway) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <List.Item.Meta
                    title={<Link to={`/pathways/${pathway._id}`}><Text strong>{pathway.title}</Text></Link>}
                    description={<Text type="secondary">{pathway.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default PathwayList;