
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'

import { Color, Link, ResetMarksOnEnter, Selection } from '../extensions'
import { useEffect } from 'react'
export const usePandaEditor = () => {

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
        code: { HTMLAttributes: { class: 'inline inline-code', spellcheck: 'false' } },
        dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' }
      }),
      Highlight.configure({ multicolor: true }),
      Selection,
      Underline,
      TextStyle,
      Color,
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

  useEffect(() => {
    // Stop editor shortcuts from bubbling up to the document
    const stopShortcuts = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && editor?.isFocused) {
        e.stopPropagation()
      }
    }
    document.addEventListener('keydown', stopShortcuts)
    return () => document.removeEventListener('keydown', stopShortcuts)
  }, [editor])

  return { editor }
}