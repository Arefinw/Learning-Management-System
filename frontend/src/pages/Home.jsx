/**
 * @file Home.jsx
 * @description This component is the home page of the application.
 * It displays a welcome message to users.
 * @module pages/Home
 * @requires react
 * @requires antd
 */

import React from 'react';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * @component Home
 * @description The home page of the application.
 * @returns {JSX.Element} The home page component.
 */
const Home = () => {
  return (
    <Layout className="min-h-screen flex items-center justify-center gradient-background">
      <Content className="text-center p-64">
        <Title style={{ color: 'white', fontSize: '64px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>Welcome to the Learning Management System</Title>
        <Text style={{ color: 'white', fontSize: '24px' }}>Your journey to knowledge begins here.</Text>
      </Content>
    </Layout>
  );
};

export default Home;