import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'

import { LinkToolbar } from './components'
import { Link, ResetMarksOnEnter } from './extensions'
import { TopToolbar } from './components/toolbar/top-toolbar'

export function DocEditor() {

  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
        paragraph: { HTMLAttributes: { class: 'text-node' } },
        heading: { HTMLAttributes: { class: 'heading-node' } },
        blockquote: { HTMLAttributes: { class: 'block-node' } },
        bulletList: { HTMLAttributes: { class: 'list-node' } },
        orderedList: { HTMLAttributes: { class: 'list-node' } },
        code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
        dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' }
      }),
      Underline,
      TextStyle,
      Link,
      ResetMarksOnEnter
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
      <LinkToolbar editor={editor} />

    </div>
  )
}