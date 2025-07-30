/**
 * @file PathwayEditor.jsx
 * @description This component provides an interface for editing a pathway.
 * It allows users to add, remove, reorder, and mark items as complete.
 * @module components/pathway/PathwayEditor
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
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import Error from '../common/Error';

// Ant Design Components
import { Layout, Card, Typography, Button, List, Space, Form, Input, Select, Checkbox, Modal, Spin, Alert } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  LinkOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

/**
 * @component PathwayEditor
 * @description A component for editing the details and items of a pathway.
 * @returns {JSX.Element} The pathway editor interface.
 */
const PathwayEditor = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItemForm] = Form.useForm();

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

  /**
   * @function handleAddItem
   * @description Adds a new item to the pathway.
   * @param {object} values - The form values for the new item.
   * @returns {Promise<void>}
   */
  const handleAddItem = async (values) => {
    try {
      const response = await api.post(`/api/pathways/${id}/items`, values);
      setPathway(response.data.data); // Backend should return updated pathway with new item
      newItemForm.resetFields();
      Modal.success({ content: 'Item added successfully!' });
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * @function handleRemoveItem
   * @description Removes an item from the pathway.
   * @param {string} itemId - The ID of the item to remove.
   * @returns {Promise<void>}
   */
  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/api/pathways/${id}/items/${itemId}`);
      setPathway((prevPathway) => ({
        ...prevPathway,
        items: prevPathway.items.filter((item) => item._id !== itemId),
      }));
      Modal.success({ content: 'Item removed successfully!' });
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * @function showRemoveConfirm
   * @description Shows a confirmation modal before removing an item.
   * @param {object} item - The item to be removed.
   */
  const showRemoveConfirm = (item) => {
    confirm({
      title: `Do you really want to remove this item?`,
      icon: <ExclamationCircleOutlined />,
      content: `${item.type}: ${item.content}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleRemoveItem(item._id);
      },
    });
  };

  /**
   * @function handleToggleCompleted
   * @description Toggles the completed status of a pathway item.
   * @param {object} item - The item to be updated.
   * @returns {Promise<void>}
   */
  const handleToggleCompleted = async (item) => {
    try {
      const newCompletedStatus = !item.completed;
      const response = await api.put(`/api/pathways/${id}/items/${item._id}/complete`, { completed: newCompletedStatus });
      setPathway(response.data.data); // Backend should return updated pathway
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  /**
   * @function handleMoveItem
   * @description Moves an item up or down in the pathway list.
   * @param {string} itemId - The ID of the item to move.
   * @param {string} direction - The direction to move the item ('up' or 'down').
   * @returns {Promise<void>}
   */
  const handleMoveItem = async (itemId, direction) => {
    try {
      const response = await api.put(`/api/pathways/${id}/items/${itemId}/move`, { direction });
      setPathway(response.data.data); // Backend should return updated pathway with new order
    } catch (err) {
      Modal.error({ content: err.response?.data?.message || err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-content">
        <Spin size="large" tip="Loading Pathway..." />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!pathway) {
    return <Error message="Pathway not found." />;
  }

  const isOwner = user && (
    (pathway.project && pathway.project.owner && user._id === pathway.project.owner._id) ||
    (pathway.folder && pathway.folder.project && pathway.folder.project.owner && user._id === pathway.folder.project.owner._id)
  );

  /**
   * @function getItemIcon
   * @description Returns an icon based on the pathway item type.
   * @param {string} type - The type of the pathway item.
   * @returns {JSX.Element}
   */
  const getItemIcon = (type) => {
    switch (type) {
      case 'Link':
        return <LinkOutlined />;
      case 'Video':
        return <VideoCameraOutlined />;
      case 'Document':
        return <FileTextOutlined />;
      default:
        return <BookOutlined />;
    }
  };

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Title level={2} style={{ color: '#333333', marginBottom: '32px' }}>Editing: {pathway.title}</Title>

        <Card style={{ marginBottom: '32px' }}>
          <Title level={3} style={{ color: '#6A5ACD' }}>Pathway Items</Title>
          {pathway.items && pathway.items.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={pathway.items}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    isOwner && <Button
                      type="text"
                      icon={<UpOutlined />}
                      onClick={() => handleMoveItem(item._id, 'up')}
                      disabled={index === 0}
                      style={{ color: '#4b5563' }}
                    />,
                    isOwner && <Button
                      type="text"
                      icon={<DownOutlined />}
                      onClick={() => handleMoveItem(item._id, 'down')}
                      disabled={index === pathway.items.length - 1}
                      style={{ color: '#4b5563' }}
                    />,
                    isOwner && <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showRemoveConfirm(item)}
                    />,
                  ]}
                  style={{ padding: '16px 0' }}
                >
                  <List.Item.Meta
                    avatar={isOwner ? <Checkbox checked={item.completed} onChange={() => handleToggleCompleted(item)} /> : <Checkbox checked={item.completed} disabled />}
                    title={<Text strong>{getItemIcon(item.type)} {item.type}: {item.content}</Text>}
                    description={<Text type="secondary">{item.description}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No items in this pathway yet.</Text>
          )}
        </Card>

        {isOwner && (
          <Card>
            <Title level={3} style={{ color: '#6A5ACD' }}>Add New Item</Title>
            <Form form={newItemForm} onFinish={handleAddItem} layout="vertical" style={{ gap: '16px' }}>
              <Form.Item
                name="type"
                label={<span style={{ color: '#374151' }}>Item Type</span>}
                rules={[{ required: true, message: 'Please select an item type!' }]}
                initialValue="Link"
              >
                <Select size="large" onChange={setSelectedItemType}>
                  <Option value="Link">Link</Option>
                  <Option value="Video">Video</Option>
                  <Option value="Document">Document</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="title"
                label={<span style={{ color: '#374151' }}>Title</span>}
                rules={[{ required: true, message: 'Please input the title!' }]}
              >
                <Input size="large" placeholder="Title of the item" />
              </Form.Item>

              {selectedItemType === 'Link' && (
                <Form.Item
                  name="url"
                  label={<span style={{ color: '#374151' }}>URL</span>}
                  rules={[{ required: true, message: 'Please input the URL!' }, { type: 'url', message: 'Please enter a valid URL!' }]}
                >
                  <Input size="large" placeholder="e.g., https://example.com" />
                </Form.Item>
              )}

              {selectedItemType === 'Video' && (
                <>
                  <Form.Item
                    name="url"
                    label={<span style={{ color: '#374151' }}>Video URL</span>}
                    rules={[{ required: true, message: 'Please input the video URL!' }, { type: 'url', message: 'Please enter a valid URL!' }]}
                  >
                    <Input size="large" placeholder="e.g., https://youtube.com/watch?v=abc" />
                  </Form.Item>
                  <Form.Item
                    name="duration"
                    label={<span style={{ color: '#374151' }}>Duration (seconds)</span>}
                    rules={[{ type: 'number', message: 'Please enter a valid number!' }]}
                  >
                    <Input type="number" size="large" placeholder="e.g., 300" />
                  </Form.Item>
                  <Form.Item
                    name="thumbnail"
                    label={<span style={{ color: '#374151' }}>Thumbnail URL (Optional)</span>}
                    rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
                  >
                    <Input size="large" placeholder="e.g., https://example.com/thumbnail.jpg" />
                  </Form.Item>
                </>
              )}

              {selectedItemType === 'Document' && (
                <Form.Item
                  name="content"
                  label={<span style={{ color: '#374151' }}>Document Content (Markdown)</span>}
                  rules={[{ required: true, message: 'Please input the document content!' }]}
                >
                  <Input.TextArea rows={8} size="large" placeholder="Write your document content in Markdown" />
                </Form.Item>
              )}

              <Form.Item
                name="description"
                label={<span style={{ color: '#374151' }}>Description (Optional)</span>}
              >
                <Input.TextArea rows={2} size="large" placeholder="Brief description of the item" />
              </Form.Item>
              <Form.Item style={{ marginBottom: '0' }}>
                <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                  Add Item
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default PathwayEditor;
