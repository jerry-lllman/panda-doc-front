import { EditorContent } from '@tiptap/react'
import { usePandaEditor } from './hooks/use-panda-editor'
import { TextToolbar, LinkToolbar } from './components'

import '@/assets/styles/keyframe-animations.less'
import '@/assets/styles/tip-tap.less'

export default function DashboardPage() {

  const { editor } = usePandaEditor()


  if (!editor) {
    return null
  }


  return (
    <div className='relative' >
      <EditorContent
        className='px-10'
        editor={editor}
      />
      <TextToolbar
        editor={editor}
      />
      <LinkToolbar
        editor={editor}
      />
    </div>
  );
} 