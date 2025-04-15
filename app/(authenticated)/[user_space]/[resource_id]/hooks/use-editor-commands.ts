import { Editor } from "@tiptap/react"
import { useCallback } from "react"
import { LinkInfo } from "../components/link/types"

export const useEditorCommands = (editor: Editor) => {
  const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor])
  const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor])
  const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor])
  const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor])
  const onCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor])
  const onLink = useCallback(
    (value: LinkInfo) => {
      const { text, href, target } = value
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .insertContent({
          type: 'text',
          text: text || href,
          marks: [
            {
              type: 'link',
              attrs: {
                href,
                target
              }
            }
          ]
        })
        .setLink({ href })
        .run()
    }
    , [editor]
  )

  return {
    onBold,
    onItalic,
    onUnderline,
    onStrike,
    onCode,
    onLink
  }
}