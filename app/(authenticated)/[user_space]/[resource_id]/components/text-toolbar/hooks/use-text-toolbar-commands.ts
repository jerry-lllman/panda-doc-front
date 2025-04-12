import { Editor } from "@tiptap/react"
import { useCallback } from "react"

export const useTextToolbarCommands = (editor: Editor) => {
  const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor])
  const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor])
  const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor])
  const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor])
  const onCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor])

  return {
    onBold,
    onItalic,
    onUnderline,
    onStrike,
    onCode,
  }
}