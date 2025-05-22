import type { Editor } from '@tiptap/react';
import { ReactRenderer } from '@tiptap/react'
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import tippy from 'tippy.js'

import EmojiPlane from './emoji-plane'
import type { RefAttributes } from 'react'
import type { EmojiPlaneProps } from './types'

export * from './emoji-base'

export const emojiSuggestion = {
  items: ({ editor }: { editor: Editor }) => editor.storage.emoji.emojis,

  allowSpaces: false,
  render: () => {
    let component: ReactRenderer<
      { onKeyDown: (evt: SuggestionKeyDownProps) => boolean },
      EmojiPlaneProps & RefAttributes<{ onKeyDown: (evt: SuggestionKeyDownProps) => boolean }>
    >
    let popup: ReturnType<typeof tippy>

    return {
      onStart: (props: SuggestionProps<any>) => {
        component = new ReactRenderer(EmojiPlane, {
          props,
          editor: props.editor,
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: SuggestionProps<any>) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          component.destroy()

          return true
        }

        return false
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },

}

