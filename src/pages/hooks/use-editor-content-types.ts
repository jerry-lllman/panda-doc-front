import { Editor, useEditorState } from "@tiptap/react"
import { Heading1, Heading2, Heading3, List, ListOrdered, ListTodo, Quote, SquareCode, Type } from 'lucide-react'

export interface TextToolbarContentTypes {
  id: string
  type: 'option'
  icon: React.ComponentType
  label: string
  onClick: () => void
  isActive: () => boolean
  isDisabled: () => boolean
}

export const useEditorContentTypes = (editor: Editor) => {

  return useEditorState({
    editor,
    selector: (ctx): TextToolbarContentTypes[] => [
      {
        icon: Type,
        id: 'text',
        type: 'option',
        label: 'Text',
        onClick: () => editor.chain().focus().setParagraph().run(),
        isActive: () => ctx.editor.isActive('paragraph'),
        isDisabled: () => !ctx.editor.can().setParagraph(),
      },
      {
        icon: Heading1,
        id: 'heading-1',
        type: 'option',
        label: 'Heading1',
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => ctx.editor.isActive('heading', { level: 1 }),
        isDisabled: () => !ctx.editor.can().toggleHeading({ level: 1 }),
      },
      {
        icon: Heading2,
        id: 'heading-2',
        type: 'option',
        label: 'Heading2',
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => ctx.editor.isActive('heading', { level: 2 }),
        isDisabled: () => !ctx.editor.can().toggleHeading({ level: 2 }),
      },
      {
        icon: Heading3,
        id: 'heading-3',
        type: 'option',
        label: 'Heading3',
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => ctx.editor.isActive('heading', { level: 3 }),
        isDisabled: () => !ctx.editor.can().toggleHeading({ level: 3 }),
      },
      {
        icon: List,
        id: 'bulleted-list',
        type: 'option',
        label: 'Bulleted list',
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => ctx.editor.isActive('bulletList'),
        isDisabled: () => !ctx.editor.can().toggleBulletList(),
      },
      {
        icon: ListOrdered,
        id: 'numbered-list',
        type: 'option',
        label: 'Numbered list',
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => ctx.editor.isActive('orderedList'),
        isDisabled: () => !ctx.editor.can().toggleOrderedList(),
      },
      {
        icon: ListTodo,
        id: 'todo-list',
        type: 'option',
        label: 'Todo list',
        onClick: () => editor.chain().focus().toggleTaskList().run(),
        isActive: () => ctx.editor.isActive('taskList'),
        isDisabled: () => !ctx.editor.can().toggleTaskList(),
      },
      {
        icon: SquareCode,
        id: 'code-block',
        type: 'option',
        label: 'Code block',
        onClick: () => {
          editor.chain().focus().toggleCodeBlock().run()
        },
        isActive: () => ctx.editor.isActive('codeBlock'),
        isDisabled: () => !ctx.editor.can().toggleCodeBlock(),
      },
      {
        icon: Quote,
        id: 'blockquote',
        type: 'option',
        label: 'Blockquote',
        onClick: () => ctx.editor.chain().focus().toggleBlockquote().run(),
        isActive: () => ctx.editor.isActive('blockquote'),
        isDisabled: () => !ctx.editor.can().toggleBlockquote(),
      }
    ]
  })
}