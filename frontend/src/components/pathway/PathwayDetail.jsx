import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';


// Ant Design Components
import { Layout, Card, Typography, Button, List, Space } from 'antd';
import { EditOutlined, BookOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

const PathwayDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathwayDetails = async () => {
      try {
        const response = await api.get(`/api/pathways/${id}`);
        setPathway(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchPathwayDetails();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!pathway) {
    return <Error message="Pathway not found." />;
  }

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Title level={2} style={{ color: '#333333', marginBottom: '16px' }}>{pathway.title}</Title>
            <Text style={{ color: '#374151', marginBottom: '16px', display: 'block' }}>{pathway.description}</Text>
            <Link to={`/pathways/${pathway._id}/edit`}>
              <Button type="primary" icon={<EditOutlined />}>Edit Pathway</Button>
            </Link>
          </Card>

          <Card title={<Title level={3} style={{ color: '#6A5ACD' }}>Pathway Items</Title>}>
            {pathway.items && pathway.items.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={pathway.items}
                renderItem={(item) => (
                  <List.Item style={{ padding: '16px 0' }}>
                    <List.Item.Meta
                      avatar={<BookOutlined style={{ color: '#6A5ACD', fontSize: '20px' }} />}
                      title={<Text strong>{item.type}: {item.content}</Text>}
                      description={<Text type="secondary">Completed: {item.completed ? 'Yes' : 'No'}</Text>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">No items in this pathway yet.</Text>
            )}
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default PathwayDetail;
