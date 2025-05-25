import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditorContent } from '@tiptap/react'
import { usePandaEditor } from './hooks/use-panda-editor'
import { TextToolbar, LinkToolbar } from './components'

import '@/assets/styles/keyframe-animations.less'
import '@/assets/styles/tip-tap.less'
import { DragHandleComponent } from './extensions/draggable/drag-handle'

interface Document {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}


const getRandomName = () => {
  return Math.random().toString(36).substring(2, 15)
}

const getRandomAvatar = () => {
  return `https://ui-avatars.com/api/?name=${getRandomName()}&background=random&color=fff`
}

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = getRandomName()
  const userAvatar = getRandomAvatar()
  const { editor } = usePandaEditor(id, userName, userAvatar)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }

        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  if (!editor) {
    return null
  }

  if (loading) return <div>Loading document...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!document) return <div>Document not found</div>;

  return (
    <div className='relative flex flex-col flex-1 h-full overflow-hidden min-w-4xl' >
      <EditorContent
        className='flex-1 overflow-y-auto'
        editor={editor}
      />
      <TextToolbar
        editor={editor}
      />
      <LinkToolbar
        editor={editor}
      />
      <DragHandleComponent
        editor={editor}
      />
    </div>
  );
};

export default DocumentPage; 