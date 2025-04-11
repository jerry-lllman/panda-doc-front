import { EditorContent } from '@tiptap/react'

import { TopToolbar } from './components'
import { usePandaEditor } from './hooks/use-panda-editor'

import './styles.css'

export function DocEditor() {

  const { editor } = usePandaEditor()

  if (!editor) {
    return null
  }

  return (
    <div className='tiptap relative'>
      <TopToolbar
        editor={editor}
        className='px-4'
        // variant='outline'
        items={['bold', 'italic', 'underline', 'strikethrough', 'code', 'link', 'clearFormatting']}
      />
      <EditorContent
        className='px-10'
        editor={editor}
      // onMouseOver={e => {
      //   const { className } = (e.target as HTMLElement)
      //   console.log(className)
      // }}
      />

    </div>
  )
}