import { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Avatar, Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { Document } from '@/types/document';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { toString } from 'lodash-es';
import emojiData, { type EmojiMartData } from '@emoji-mart/data'
import { ThemeToggle } from './ThemeToggle';

const { Sider, Content, Header } = AntLayout;

type MenuItem = Required<MenuProps>['items'][number];

// Function to get a random emoji key
const getRandomEmojiKey = () => {
  const keys = Object.keys((emojiData as EmojiMartData).emojis);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
};

const getEmojiNative = (key: string) => {
  return (emojiData as EmojiMartData).emojis[key].skins[0].native
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const res = await response.json();
      setDocuments(res.data);
    } catch {
      console.log('Error fetching documents, using mock data instead');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Prepare menu items including static routes and dynamic document routes
  const menuItems: MenuItem[] = useMemo(() =>
    documents.map(doc => ({
      key: doc.id,
      icon: <span>{getEmojiNative(doc.icon)}</span>,
      label: <Link to={`/${doc.id}`}>{doc.title}</Link>,
    })),
    [documents]
  )

  // Determine which menu item should be selected based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    const key = toString(menuItems.find(item => `/${item!.key}` === path)?.key)
    return [key];
  };

  const handleAddNew = () => {
    const randomEmojiKey = getRandomEmojiKey();

    fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '新文档',
        createdBy: 'jerry',
        icon: randomEmojiKey,
      }),
    })
      .then(res => res.json())
      .then(async ({ data }) => {
        await fetchDocuments()
        navigate(`/${data.id}`)
      })
  }


  return (
    <AntLayout className='h-screen'  >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical h-8 m-4" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
        <Button type='text' className='w-full' onClick={handleAddNew}>Add new</Button>
        <Menu
          mode="inline"
          style={{ borderInlineEnd: 'none' }}
          selectedKeys={getSelectedKey()}
          items={menuItems}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, }}>
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
        </Header>

        <Content id='layout-content'>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
} 