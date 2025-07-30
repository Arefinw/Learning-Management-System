/**
 * @file PathwayDetail.jsx
 * @description This component displays the details of a single pathway.
 * It fetches pathway data from the backend and displays the title, description, and a list of items.
 * @module components/pathway/PathwayDetail
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
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';


// Ant Design Components
import { Layout, Card, Typography, Button, List, Space } from 'antd';
import { EditOutlined, BookOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * @component PathwayDetail
 * @description A component that displays the details of a specific pathway.
 * @returns {JSX.Element} The pathway detail page.
 */
const PathwayDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * @function fetchPathwayDetails
     * @description Fetches the details of the pathway from the backend.
     * @returns {Promise<void>}
     */
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * @function showItemModal
   * @description Opens the modal to display the content viewer for a selected item.
   * @param {object} item - The item to be displayed.
   */
  const showItemModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  /**
   * @function handleCancelModal
   * @description Closes the content viewer modal.
   */
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

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
                      title={
                        <a onClick={() => showItemModal(item)} style={{ cursor: 'pointer' }}>
                          <Text strong>{item.type}: {item.content.title || item.content.url || item.content.name || item.content}</Text>
                        </a>
                      }
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

        <Modal
          title={selectedItem ? `${selectedItem.type} Content` : 'Content'}
          open={isModalVisible}
          onCancel={handleCancelModal}
          footer={null}
          width={800}
        >
          {selectedItem && (
            <ContentViewer itemType={selectedItem.type} itemId={selectedItem.content._id} />
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default PathwayDetail;