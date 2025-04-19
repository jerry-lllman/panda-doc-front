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