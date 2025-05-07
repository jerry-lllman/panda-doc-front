import { EditorContent } from '@tiptap/react'

import { TextToolbar } from './components'
import { LinkToolbar } from './components/link'
import '@/styles/_variables.scss'
import '@/styles/_keyframe-animations.scss'
import './styles.css'
import 'highlight.js/styles/atom-one-dark.css';

import { useRef } from 'react'
import { usePandaEditor } from './hooks/use-panda-editor'

export function DocEditor() {
  const { editor } = usePandaEditor()

  const menuContainerRef = useRef<HTMLDivElement>(null)

  if (!editor) {
    return null
  }

  return (
    <div className=' relative' ref={menuContainerRef}>
      {/* <TopToolbar
        editor={editor}
        className='px-4'
        // variant='outline'
        items={['bold', 'italic', 'underline', 'strikethrough', 'code', 'link', 'clearFormatting']}
      /> */}
      <EditorContent
        className='px-10'
        editor={editor}
      // onMouseOver={e => {
      //   const { className } = (e.target as HTMLElement)
      //   console.log(className)
      // }}
      />
      <TextToolbar
        editor={editor}
      />
      <LinkToolbar
        editor={editor}
      />
    </div>
  )
}