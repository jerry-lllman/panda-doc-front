import { Editor, useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { ShouldShowProps } from "../components/link/types";
import { isTextSelected } from "../utils";
import { isCustomTextNode } from "@/lib/utils/is-custom-text-node";

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

  const shouldShow = useCallback(
    ({ view }: ShouldShowProps) => {
      if (!view || editor.view.dragging) return false

      console.log('%c👉  isCustomTextNode(editor): ', 'background:#41b883;padding:1px; border-radius: 0 3px 3px 0;color: #fff', isCustomTextNode(editor)) // 👈
      if (isCustomTextNode(editor)) {
        return false
      }

      return isTextSelected(editor)
    }, [editor])

  return {
    shouldShow,
    ...states,
  }
}