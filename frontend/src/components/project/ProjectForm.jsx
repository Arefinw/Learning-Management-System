/**
 * @file ProjectForm.jsx
 * @description This file implements the ProjectForm component, used for creating and editing projects using Ant Design.
 * It handles form submission, validation, and interaction with the backend API.
 * @module components/project/ProjectForm
 * @requires react
 * @requires react-router-dom
 * @requires ../../services/api
 * @requires antd
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';



// Ant Design Components
import { Layout, Form, Input, Select, Button, Card, Typography, message } from 'antd';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

/**
 * @component ProjectForm
 * @description A form for creating and editing projects.
 * @param {object} props - The component props.
 * @param {boolean} [props.isEditMode=false] - Whether the form is in edit mode.
 * @returns {JSX.Element} The ProjectForm component.
 */
const ProjectForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workspaceIdFromUrl = queryParams.get('workspaceId');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [workspaces, setWorkspaces] = useState([]); // To populate workspace dropdown

  useEffect(() => {
    /**
     * @function fetchData
     * @description Fetches workspaces for the dropdown and project data if in edit mode.
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      try {
        // Fetch workspaces for dropdown
        const workspacesResponse = await api.get('/api/workspaces');
        setWorkspaces(workspacesResponse.data.data);

        if (isEditMode && id) {
          const projectResponse = await api.get(`/api/projects/${id}`);
          const projectData = projectResponse.data.data;
          form.setFieldsValue({ ...projectData, workspace: projectData.workspace ? projectData.workspace._id : undefined });
        } else if (workspaceIdFromUrl) {
          form.setFieldsValue({ workspace: workspaceIdFromUrl });
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [isEditMode, id, form, workspaceIdFromUrl]);

  /**
   * @function onFinish
   * @description Handles form submission.
   * @param {object} values - The form values.
   * @returns {Promise<void>}
   */
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode) {
        await api.put(`/api/projects/${id}`, values);
        message.success('Project updated successfully!');
        navigate(`/projects/${id}`);
      } else {
        const response = await api.post('/api/projects', values);
        message.success('Project created successfully!');
        navigate(`/projects/${response.data.data._id}`);
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
        <Title level={2} className="text-neutral-800 mb-32">{isEditMode ? 'Edit Project' : 'Create New Project'}</Title>
        <Card bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ visibility: 'private' }} // Set default for new project
            className="space-y-4"
          >
            <Form.Item
              name="name"
              label={<span className="text-neutral-700">Project Name</span>}
              rules={[{ required: true, message: 'Please input the project name!' }]}
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
              name="workspace"
              label={<span className="text-neutral-700">Workspace</span>}
              rules={[{ required: true, message: 'Please select a workspace!' }]}
            >
              <Select placeholder="Select a Workspace" size="large">
                {workspaces.map((ws) => (
                  <Option key={ws._id} value={ws._id}>
                    {ws.name}
                  </Option>
                ))}
              </Select>
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
                {loading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default ProjectForm;
