import { EditorContent } from '@tiptap/react'
import { usePandaEditor } from './hooks/use-panda-editor'
import { TextToolbar, LinkToolbar } from './components'

import '@/assets/styles/keyframe-animations.less'
import '@/assets/styles/tip-tap.less'
import { DragHandleComponent } from './extensions/draggable/drag-handle'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'antd'

const getRandomName = () => {
  return Math.random().toString(36).substring(2, 15)
}

const getRandomAvatar = () => {
  return `https://ui-avatars.com/api/?name=${getRandomName()}&background=random&color=fff`
}

export default function DashboardPage() {

  const userName = getRandomName()
  const userAvatar = getRandomAvatar()
  const [searchParams] = useSearchParams()
  const docId = searchParams.get('docId') || ''

  const { editor } = usePandaEditor(docId, userName, userAvatar)

  if (!editor) {
    return null
  }

  const handleCreateDoc = () => {
    fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '新文档',
        createdBy: userName,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }

  const handleGetDocs = () => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }
  return (
    <div className='relative flex flex-col flex-1 h-full overflow-hidden min-w-4xl' >
      <div>
        <Button type='primary' onClick={handleCreateDoc}>创建文档</Button>
        <Button onClick={handleGetDocs}>获取文档</Button>
      </div>
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
} 