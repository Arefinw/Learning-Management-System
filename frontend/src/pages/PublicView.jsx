import React from 'react';
import { Layout, Typography, Card } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

const PublicView = () => {
  return (
    <Layout className="p-16 bg-transparent">
      <Content>
        <Card>
          <Title level={2} style={{ color: '#333333', marginBottom: '16px' }}>Public View</Title>
          <Text style={{ color: '#374151' }}>This is where publicly shared content will be displayed.</Text>
        </Card>
      </Content>
    </Layout>
  );
};

export default PublicView;
