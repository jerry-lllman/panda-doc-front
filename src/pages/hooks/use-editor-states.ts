import { Editor, useEditorState } from "@tiptap/react";
import { useCallback, useState } from "react";
import type { ShouldShowProps } from "../components/link/types";
import { isTextSelected, isCustomTextNode } from "@/utils";

export const useEditorContentStates = (editor: Editor) => {

  const states = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
      isCode: ctx.editor.isActive('code'),
      currentColor: ctx.editor.getAttributes('textStyle').color,
      currentHighlight: ctx.editor.getAttributes('highlight').color,
    })
  })

  const [showContent, setShowContent] = useState(false)

  const shouldShow = useCallback(
    ({ view }: ShouldShowProps) => {
      if (!view || editor.view.dragging) {
        setShowContent(false)
        return false
      }

      if (isCustomTextNode(editor)) {
        setShowContent(false)
        return false
      }

      const isShow = isTextSelected(editor)
      setShowContent(isShow)
      return isShow
    }, [editor])

  return {
    shouldShow,
    showContent,
    ...states,
  }
}