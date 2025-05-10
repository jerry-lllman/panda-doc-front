import { Editor, isTextSelection } from "@tiptap/react"

type ShortcutKeyResult = {
  symbol: string
  readable: string
}

export const isClient = (): boolean => typeof window !== 'undefined'
export const isServer = (): boolean => !isClient()
export const isMacOS = (): boolean => isClient() && window.navigator.platform === 'MacIntel'

const shortcutKeyMap: Record<string, ShortcutKeyResult> = {
  mod: isMacOS() ? { symbol: '⌘', readable: 'Command' } : { symbol: 'Ctrl', readable: 'Control' },
  alt: isMacOS() ? { symbol: '⌥', readable: 'Option' } : { symbol: 'Alt', readable: 'Alt' },
  shift: { symbol: '⇧', readable: 'Shift' }
}

export const getShortcutKey = (key: string): ShortcutKeyResult =>
  shortcutKeyMap[key.toLowerCase()] || { symbol: key, readable: key }

export const isTextSelected = (editor: Editor) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to }
    }
  } = editor

  const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(selection)

  if (empty || isEmptyTextBlock || !editor.isEditable) return false

  return true
}