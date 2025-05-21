import type { EmojiItem } from '../emoji/types'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import type { ForwardedRef, } from 'react'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'

import type { EmojiListProps } from './types'
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'

const EmojiList = forwardRef(
  (props: EmojiListProps, ref: ForwardedRef<{ onKeyDown: (evt: SuggestionKeyDownProps) => boolean }>) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => setSelectedIndex(0), [props.items])

    const selectItem = useCallback(
      (index: number) => {
        const item = props.items[index]

        if (item) {
          console.log('%c👉  name: ', 'background:#41b883;padding:1px; border-radius: 0 3px 3px 0;color: #fff', name) // 👈
          props.command({ name: item.name })
        }
      },
      [props],
    )

    useImperativeHandle(ref, () => {
      const scrollIntoView = (index: number) => {
        const item = props.items[index]

        if (item) {
          const node = document.querySelector(`[data-emoji-name="${item.name}"]`)

          if (node) {
            node.scrollIntoView({ block: 'nearest' })
          }
        }
      }

      const upHandler = () => {
        const newIndex = (selectedIndex + props.items.length - 1) % props.items.length
        setSelectedIndex(newIndex)
        scrollIntoView(newIndex)
      }

      const downHandler = () => {
        const newIndex = (selectedIndex + 1) % props.items.length
        setSelectedIndex(newIndex)
        scrollIntoView(newIndex)
      }

      const enterHandler = () => {
        selectItem(selectedIndex)
      }

      return {
        onKeyDown: ({ event }) => {
          if (event.key === 'ArrowUp') {
            upHandler()
            return true
          }

          if (event.key === 'ArrowDown') {
            downHandler()
            return true
          }

          if (event.key === 'Enter') {
            enterHandler()
            return true
          }

          return false
        },
      }
    }, [props, selectedIndex, selectItem])


    const onEmojiSelect = useCallback((item: EmojiItem) => {
      props.command({ name: item.id })
    }, [props])

    if (!props.items || !props.items.length) {
      return null
    }

    return (
      <EmojiPicker
        data={data}
        onEmojiSelect={onEmojiSelect}
      />
    )
  },
)

EmojiList.displayName = 'EmojiList'

export default EmojiList
