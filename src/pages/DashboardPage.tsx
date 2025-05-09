import { Typography, Card, Row, Col, Statistic, Space } from 'antd';
import { FileOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Dashboard</Title>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Documents"
              value={112}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Users"
              value={24}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Teams"
              value={8}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Activity" style={{ width: '100%' }}>
        <Paragraph>
          Your recent document activity will appear here.
        </Paragraph>
      </Card>
    </Space>
  );
} 