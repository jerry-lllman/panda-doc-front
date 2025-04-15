
import type { BubbleMenuProps } from '@tiptap/react'

export type ShouldShowProps = Parameters<BubbleMenuProps['shouldShow']>[0]

export interface LinkInfo {
  text: string
  href: string
  target: string
}