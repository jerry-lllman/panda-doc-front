import React from 'react';
import { useParams } from 'react-router-dom';
import { EditorContent } from '@tiptap/react'
import { usePandaEditor } from './hooks/use-panda-editor'
import { TextToolbar, LinkToolbar } from './components'

import '@/assets/styles/keyframe-animations.less'
import '@/assets/styles/tip-tap.less'
import { DragHandleComponent } from './extensions/draggable/drag-handle'


const getRandomName = () => {
  return Math.random().toString(36).substring(2, 15)
}

const getRandomAvatar = () => {
  return `https://ui-avatars.com/api/?name=${getRandomName()}&background=random&color=fff`
}

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const userName = getRandomName()
  const userAvatar = getRandomAvatar()
  const { editor, loading } = usePandaEditor(id!, userName, userAvatar)

  if (!editor) {
    return null
  }

  if (loading) return <div>Loading document...</div>;

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