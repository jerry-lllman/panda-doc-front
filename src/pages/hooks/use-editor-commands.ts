import { Editor } from "@tiptap/react"
import { useCallback } from "react"
import type { LinkInfo } from "../components/link/types"

export const useEditorCommands = (editor: Editor) => {
  const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor])
  const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor])
  const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor])
  const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor])
  const onCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor])
  const onBlockquote = useCallback(() => editor.chain().focus().toggleBlockquote().run(), [editor])
  const onLink = useCallback(
    (value: LinkInfo) => {
      const { href } = value
      editor
        .chain()
        .focus()
        .setLink({ href })
        .run()
    }
    , [editor]
  )
  const onColor = useCallback((color: string) => {
    editor.chain().setColor(color).run()
  }, [editor])
  const onHighlight = useCallback((color: string) => {
    if (color) {
      editor.chain().focus().setHighlight({ color }).run()
    } else {
      editor.chain().focus().unsetHighlight().run()
    }
  }, [editor])

  return {
    onBold,
    onItalic,
    onUnderline,
    onStrike,
    onCode,
    onLink,
    onColor,
    onHighlight,
    onBlockquote
  }
}