import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, theme } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ThemeToggle } from './ThemeToggle';

const { Header, Sider, Content } = AntLayout;

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // Determine which menu item should be selected based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['home'];
    if (path === '/about') return ['about'];
    if (path === '/dashboard') return ['dashboard'];
    return ['home'];
  };

  return (
    <AntLayout className='h-screen'  >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical h-8 m-4" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          mode="inline"
          style={{ borderInlineEnd: 'none' }}
          selectedKeys={getSelectedKey()}
          items={[
            {
              key: 'home',
              icon: <HomeOutlined />,
              label: <Link to="/">Home</Link>,
            },
            {
              key: 'about',
              icon: <InfoCircleOutlined />,
              label: <Link to="/about">About</Link>,
            },
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
          ]}
        />
      </Sider>
      <AntLayout>
        {/* <Header style={{ padding: 0, }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingInline: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ThemeToggle />
              <span>Panda Doc</span>
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </Header> */}
        <Content
          id='layout-content'
          style={{
            margin: '16px auto',
            padding: 16,
            // background: colorBgContainer,
            borderRadius: borderRadiusLG,
            /**
             * That's how we'll handle it for now
             * The optimise it later when we want to show the catalogue 
             */
            maxWidth: '708px',
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
} 