import { Typography, Card, Space } from 'antd';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Welcome to Panda Doc</Title>
      <Paragraph>
        A modern document management system built with React and Ant Design.
      </Paragraph>
      <Card title="Getting Started" style={{ width: '100%' }}>
        <Paragraph>
          This project demonstrates the use of React Router and Ant Design for building modern web applications.
          Navigate through the menu items to explore different sections.
        </Paragraph>
      </Card>
    </Space>
  );
} 