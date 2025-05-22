import { useCallback } from 'react'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'

import type { EmojiItem, EmojiPlaneProps } from './types'
const EmojiPlane = (props: EmojiPlaneProps) => {


  const onEmojiSelect = useCallback((item: EmojiItem) => {
    props.command({ name: item.id })
  }, [props])

  if (!props.items || !props.items.length) {
    return null
  }

  return (
    <EmojiPicker
      autoFocus
      data={data}
      onEmojiSelect={onEmojiSelect}
    />
  )
}

EmojiPlane.displayName = 'EmojiPlane'

export default EmojiPlane
