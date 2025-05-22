import { EditorContent } from '@tiptap/react'
import { usePandaEditor } from './hooks/use-panda-editor'
import { TextToolbar, LinkToolbar } from './components'

import '@/assets/styles/keyframe-animations.less'
import '@/assets/styles/tip-tap.less'
import { DragHandleComponent } from './extensions/draggable/drag-handle'

export default function DashboardPage() {

  const { editor } = usePandaEditor()


  if (!editor) {
    return null
  }


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
} 