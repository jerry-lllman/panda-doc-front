import { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import type { Document } from '@/types/document';
import { toString } from 'lodash-es';
import emojiData, { type EmojiMartData } from '@emoji-mart/data'

const { Sider, Content } = AntLayout;

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
  const [collapsed] = useState(false);
  const location = useLocation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

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
        icon: randomEmojiKey
      }),
    })
      .then(res => res.json())
      .then(data => {
        fetchDocuments()
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