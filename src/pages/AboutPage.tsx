import { Typography, Card, Space, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>About Panda Doc</Title>

      <Card style={{ width: '100%' }}>
        <Paragraph>
          Panda Doc is a modern document management system designed to help users organize,
          create, and share documents efficiently.
        </Paragraph>

        <Divider />

        <Title level={4}>Features</Title>
        <ul>
          <li><Text strong>Easy Navigation</Text> - Navigate between pages using the side menu</li>
          <li><Text strong>Modern UI</Text> - Built with Ant Design for a clean and professional look</li>
          <li><Text strong>Type Safety</Text> - Written in TypeScript for better development experience</li>
        </ul>
      </Card>
    </Space>
  );
} 