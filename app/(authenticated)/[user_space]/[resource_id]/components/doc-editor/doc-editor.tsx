import './styles.scss'

import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { LinkToolbar } from './components'
import { Link } from './extensions'

export function DocEditor() {

  const editor = useEditor({
    editable: true,
    extensions: [
      Document,
      Paragraph,
      Text,
      Code,
      Link,
    ],
    content: `
      <p>
        Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems to work.
      </p>
      <p>
        By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It’s configurable though.
      </p>
    `,
  })

  if (!editor) {
    return null
  }

  return (
    <div className='tiptap relative'>
      <EditorContent
        editor={editor}
      // onMouseOver={e => {
      //   const { className } = (e.target as HTMLElement)
      //   console.log(className)
      // }}
      />
      <LinkToolbar editor={editor} />

    </div>
  )
}