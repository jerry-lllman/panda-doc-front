import { Editor, useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { LinkInfo, ShouldShowProps } from "../../link/types";
import { isTextSelected } from "../../../utils";

export const useTextToolbarStates = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
      isCode: ctx.editor.isActive('code'),
      currentColor: ctx.editor.getAttributes('textStyle').color,
      currentHighlight: ctx.editor.getAttributes('highlight').highlight,
      currentLink: ctx.editor.getAttributes('link').href ? ctx.editor.getAttributes('link') as LinkInfo : undefined
    })
  })

  const shouldShow = useCallback(
    ({ view }: ShouldShowProps) => {
      if (!view || editor.view.dragging) return false

      return isTextSelected(editor)
    }, [editor])

  return {
    shouldShow,
    ...states,
  }
}