import { Editor, EditorContent } from '@tiptap/react'

import { TextToolbar } from './components'
import './styles.css'
import { LinkToolbar } from './components/link'
import { useEditorContentStates } from './hooks/use-editor-states'
import { useEditorCommands } from './hooks/use-editor-commands'

interface DocEditorProps {
  editor: Editor
}

export function DocEditor(props: DocEditorProps) {
  const { editor } = props

  const states = useEditorContentStates(editor)
  const commands = useEditorCommands(editor)

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
        states={states}
        commands={commands}
      />
      <LinkToolbar
        editor={editor}
        states={states}
        commands={commands}
      />
    </div>
  )
}