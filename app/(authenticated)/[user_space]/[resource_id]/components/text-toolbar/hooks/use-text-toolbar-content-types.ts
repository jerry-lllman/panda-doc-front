import { Editor, useEditorState } from "@tiptap/react"
import { Heading1, Heading2, Heading3, Type } from 'lucide-react'

export interface TextToolbarContentTypes {
  id: string
  type: 'option'
  icon: React.ComponentType
  label: string
  onClick: () => void
  isActive: () => boolean
  isDisabled: () => boolean
}

export const useTextToolbarContentTypes = (editor: Editor) => {

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
    ]
  })
}