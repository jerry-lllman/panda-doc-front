import type { Editor } from '@tiptap/react'
import type { BubbleMenuProps } from '@tiptap/react'

export type ShouldShowProps = Parameters<BubbleMenuProps['shouldShow']>[0]

export interface FormatAction {
  label: string
  icon?: React.ReactNode
  action: (editor: Editor) => void
  isActive: (editor: Editor) => boolean
  canExecute: (editor: Editor) => boolean
  shortcuts: string[]
  value: string
}

// declare module '@tiptap/core' {
//   interface Editor {
//     linkPopover: boolean
//     setLinkPopover: (value: boolean) => void
//   }
// }
