import { TaskList, TaskItem } from "@tiptap/extension-list";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useMemo } from 'react'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'


import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

import {
  CodeBlock,
  Color,
  Emoji,
  emojiSuggestion,
  HorizontalRule,
  linkConfig,
  ResetMarksOnEnter,
  Selection,
  SlashCommand
} from '../extensions'

import '@/assets/styles/list-node.less'


const USER_COLORS = [
  "#1a1c2c",
  "#5d275d",
  "#b13e53",
  "#ef7d57",
  "#ffcd75",
  "#a7f070",
  "#38b764",
  "#257179",
  "#29366f",
  "#3b5dc9",
  "#41a6f6",
  "#73eff7",
  "#f4f4f4",
  "#94b0c2",
  "#566c86",
  "#333c57"
];


const defaultContent = `
      <p>
        Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn't that cool? Let's try <a href="https://statamic.com/">another one!</a> Yep, seems to work.
      </p>
      <p>
        By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It's configurable though.
      </p>
    `

// import emojiSuggestion from "../extensions/emoji-mart/emoji-suggestion";
export const usePandaEditor = (docId = '123', userName: string, userAvatar: string) => {
  // Create document and provider inside the hook for better lifecycle management
  const ydoc = useMemo(() => new Y.Doc(), []);
  const provider = useMemo(() => new WebsocketProvider(`ws`, `/doc-room?docId=${docId}`, ydoc), [docId, ydoc]);

  const editor = useEditor({
    editable: true,
    onCreate: ({ editor: currentEditor }) => {
      provider.on('sync', () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent(defaultContent)
        }
      })
    },
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
        dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
        link: linkConfig
      }),
      CodeBlock,
      Highlight.configure({ multicolor: true }),
      Selection,
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      Color,
      ResetMarksOnEnter,
      HorizontalRule,
      SlashCommand,
      Emoji.configure({
        enableEmoticons: true,
        suggestion: emojiSuggestion,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCaret.configure({
        provider,
        user: {
          name: userName,
          color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
          avatar: userAvatar,
        },
        render: user => {
          const cursor = document.createElement('span')
          cursor.classList.add('collaboration-cursor')
          cursor.setAttribute('style', `border-color: ${user.color}`)

          const label = document.createElement('div')
          label.classList.add('collaboration-label')
          label.setAttribute('style', `background-color: ${user.color}`)

          if (user.avatar) {
            const avatar = document.createElement('img')
            avatar.classList.add('collaboration-avatar')
            avatar.src = user.avatar
            label.appendChild(avatar)
          }

          const name = document.createElement('span')
          name.textContent = user.name

          label.appendChild(name)
          cursor.appendChild(label)
          return cursor
        },
        selectionRender: user => {
          return {
            nodeName: 'span',
            class: 'collaboration-selection',
            style: `background-color: ${user.color}40;`,
            'data-user': user.name,
          }
        }
      }),
    ],
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

  // Handle WebSocket connection lifecycle
  useEffect(() => {
    // Connect to the collaboration room
    provider.connect()

    // Log connection status changes
    provider.on('status', (event: { status: string }) => {
      console.log('Collaboration connection status:', event.status)
    })

    return () => {
      // Clean up WebSocket connection when component unmounts
      provider.disconnect()
    }
  }, [provider])

  return { editor, provider }
}