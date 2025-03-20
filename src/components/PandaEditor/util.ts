import { withCursors, withYjs } from "@slate-yjs/core"
import { Editor, Range } from "slate"

function withLink(editor: Editor) {
  const { isInline } = editor
  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element)
  }
  return editor
}

const YJS_FNS = {
  withYjs,
  withCursors,
}

const NATIVE_FNS = {
  withYjs: (editor => editor) as typeof withYjs,
  withCursors: (editor => editor) as typeof withCursors,
  withLink,
}

export function getPandaEditorFns(needSyncDoc: boolean) {
  let fns = { ...NATIVE_FNS }
  if (needSyncDoc) {
    fns = { ...NATIVE_FNS, ...YJS_FNS }
  }
  return fns
}

export const getCurrentWordRange = (editor: Editor, trigger: string) => {

  const { selection } = editor
  if (!selection) return null

  const [start] = Range.edges(selection)
  const wordRange = Editor.before(editor, start, {
    distance: trigger.length,
    unit: 'character'
  })

  if (!wordRange) return null

  const word = Editor.string(editor, { anchor: wordRange, focus: start })

  if (word !== trigger) return null

  return { anchor: wordRange, focus: start }
}

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
