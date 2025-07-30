import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.password !== values.password2) {
      message.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    const success = await register({ name: values.name, email: values.email, password: values.password });
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-16 gradient-background">
      <Card
        className="w-full max-w-md"
        bordered={false}
      >
        <div className="text-center mb-8">
          {/* Branding Element: Replace with your logo or app name */}
          <Title level={2} className="text-primary-dark mb-2">LMS Platform</Title>
          <Text type="secondary" className="text-neutral-500">Create your account</Text>
        </div>

        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon text-neutral-400" />}
              placeholder="Name"
              size="large"
            />
          </Form.Item>

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
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }, { min: 6, message: 'Password must be at least 6 characters' }]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-neutral-400" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password2"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your Password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-neutral-400" />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <Divider className="my-8 text-neutral-400">Or register with</Divider>

        <Space direction="vertical" className="w-full space-y-4">
          <Button
            icon={<GoogleOutlined />}
            className="w-full border-neutral-300 text-neutral-700 hover:!border-primary hover:!text-primary"
            size="large"
          >
            Register with Google
          </Button>
          <Button
            icon={<FacebookOutlined />}
            className="w-full border-neutral-300 text-neutral-700 hover:!border-primary hover:!text-primary"
            size="large"
          >
            Register with Facebook
          </Button>
        </Space>

        <div className="text-center mt-8">
          <Text className="text-neutral-600">Already have an account? </Text>
          <Link to="/login" className="text-primary font-semibold hover:text-primary-dark">
            Login now!
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
