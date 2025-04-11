
import type { BubbleMenuProps } from '@tiptap/react'

export type ShouldShowProps = Parameters<BubbleMenuProps['shouldShow']>[0]

export interface LinkInfo {
  href: string
  text: string
  target: string
}