import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { Document } from '@/types/document';
import { toString } from 'lodash-es';

const { Sider, Content } = AntLayout;

type MenuItem = Required<MenuProps>['items'][number];

export default function Layout() {
  const [collapsed] = useState(false);
  const location = useLocation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch {
        console.log('Error fetching documents, using mock data instead');
      }
    };

    fetchDocuments();
  }, []);

  // Prepare menu items including static routes and dynamic document routes
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
  ];

  // Add document menu items as top-level items
  documents.forEach(doc => {
    menuItems.push({
      key: doc.id,
      icon: <FileOutlined />,
      label: <Link to={`/${doc.id}`}>{doc.title}</Link>,
    });
  });


  // Determine which menu item should be selected based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    const key = toString(menuItems.find(item => `/${item!.key}` === path)?.key)
    return [key];
  };


  return (
    <AntLayout className='h-screen'  >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical h-8 m-4" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          mode="inline"
          style={{ borderInlineEnd: 'none' }}
          selectedKeys={getSelectedKey()}
          items={menuItems}
        />
      </Sider>
      <AntLayout>
        <Content
          id='layout-content'
          style={{
            margin: '16px auto',
            padding: 16,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
} 