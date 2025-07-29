/**
 * @file WorkspaceForm.jsx
 * @description This file implements the WorkspaceForm component, used for creating and editing workspaces using Ant Design.
 * It handles form submission, validation, and interaction with the backend API.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';


// Ant Design Components
import { Layout, Form, Input, Select, Button, Card, Typography, message } from 'antd';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

/**
 * WorkspaceForm Component
 * @param {object} props - The component props.
 * @param {boolean} [props.isEditMode=false] - Whether the form is in edit mode.
 * @returns {JSX.Element} The WorkspaceForm component.
 */
const WorkspaceForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode && id) {
      /**
       * Fetches workspace data for editing.
       * @async
       * @function fetchWorkspaceData
       * @returns {Promise<void>}
       */
      const fetchWorkspaceData = async () => {
        try {
          const response = await api.get(`/api/workspaces/${id}`);
          form.setFieldsValue(response.data.data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };
      fetchWorkspaceData();
    }
  }, [isEditMode, id, form]);

  /**
   * Handles form submission.
   * @async
   * @function onFinish
   * @param {object} values - The form values.
   * @returns {Promise<void>}
   */
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode) {
        await api.put(`/api/workspaces/${id}`, values);
        message.success('Workspace updated successfully!');
        navigate(`/workspaces/${id}`);
      } else {
        const response = await api.post('/api/workspaces', values);
        message.success('Workspace created successfully!');
        navigate(`/workspaces/${response.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      message.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Title level={2} className="text-neutral-800 mb-32">{isEditMode ? 'Edit Workspace' : 'Create New Workspace'}</Title>
        <Card bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ visibility: 'private' }} // Set default for new workspace
            className="space-y-4"
          >
            <Form.Item
              name="name"
              label={<span className="text-neutral-700">Workspace Name</span>}
              rules={[{ required: true, message: 'Please input the workspace name!' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="text-neutral-700">Description</span>}
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input.TextArea rows={4} size="large" />
            </Form.Item>

            <Form.Item
              name="visibility"
              label={<span className="text-neutral-700">Visibility</span>}
              rules={[{ required: true, message: 'Please select visibility!' }]}
            >
              <Select size="large">
                <Option value="private">Private</Option>
                <Option value="public">Public</Option>
                <Option value="workspace">Workspace Members Only</Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {isEditMode ? 'Update Workspace' : 'Create Workspace'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default WorkspaceForm;