import { Editor, EditorContent } from '@tiptap/react'

import { TextToolbar } from './components'
import './styles.css'
import { LinkToolbar } from './components/link'

interface DocEditorProps {
  editor: Editor
}

export function DocEditor(props: DocEditorProps) {
  const { editor } = props

  return (
    <div className='tiptap relative'>
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
      <LinkToolbar editor={editor} />
    </div>
  )
}