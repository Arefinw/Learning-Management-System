/**
 * @file Login.jsx
 * @description This component renders the login page, allowing users to authenticate.
 * It integrates with Ant Design for UI components and Tailwind CSS for styling.
 * It uses AuthContext for authentication logic and react-router-dom for navigation.
 */

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { GoogleOutlined, FacebookOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

/**
 * Login Component
 * @returns {JSX.Element} The login form and related UI elements.
 */
const Login = () => {
  // Access login function from AuthContext
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // State to manage loading status during login
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  /**
   * Handles the form submission for user login.
   * @param {object} values - The form values containing email and password.
   */
  const onFinish = async (values) => {
    setLoading(true);
    const success = await login(values.email, values.password);
    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    // Main container for the login page with a gradient background
    <div className="min-h-screen flex items-center justify-center p-16 gradient-background">
      {/* Login Card: Modern card layout with subtle shadow */}
      <Card
        className="w-full max-w-md"
        bordered={false} // Remove default border as shadow is applied via Tailwind
      >
        {/* Header section with branding and welcome message */}
        <div className="text-center mb-8">
          {/* Branding Element: Replace with your logo or app name */}
          <Title level={2} style={{ color: '#6A5ACD' }} className="mb-2">LMS Platform</Title>
          <Text type="secondary" style={{ color: '#6b7280' }}>Welcome Back! Sign in to your account</Text>
        </div>

        {/* Login Form */}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical" // Vertical layout for form items
          className="space-y-4" // Tailwind class for spacing between form items
        >
          {/* Email Input Field */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'The input is not valid E-mail!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon text-neutral-400" />}
              placeholder="Email"
              size="large" // Large size for better usability
            />
          </Form.Item>

          {/* Password Input Field */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-neutral-400" />}
              placeholder="Password"
              size="large" // Large size for better usability
            />
          </Form.Item>

          {/* Login Button */}
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full" // Full width button
              size="large" // Large size for better usability
              loading={loading} // Show loading spinner when login is in progress
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        {/* Divider for social login options */}
        <Divider className="my-8 text-neutral-400">Or log in with</Divider>

        {/* Social Login Options */}
        <Space direction="vertical" className="w-full space-y-4">
          {/* Google Login Button */}
          <Button
            icon={<GoogleOutlined />}
            className="w-full border-neutral-300 text-neutral-700 hover:!border-primary hover:!text-primary"
            size="large"
          >
            Log in with Google
          </Button>
          {/* Facebook Login Button */}
          <Button
            icon={<FacebookOutlined />}
            className="w-full border-neutral-300 text-neutral-700 hover:!border-primary hover:!text-primary"
            size="large"
          >
            Log in with Facebook
          </Button>
        </Space>

        {/* Registration Link */}
        <div className="text-center mt-8">
          <Text className="text-neutral-600">Don't have an account? </Text>
          <Link to="/register" className="text-primary font-semibold hover:text-primary-dark">
            Register now!
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
