import { BubbleMenu } from "@tiptap/react"
import type { Editor } from '@tiptap/react'
import { useCallback, useState } from "react"
import { ShouldShowProps } from "../../types"
import { Copy, Edit, Link2 } from "lucide-react"
import copy from 'copy-to-clipboard'
import { toast } from "sonner"

interface LinkInfo {
  href: string
  text: string
  target: string
}

interface LinkToolbarProps {
  editor: Editor
}
export const LinkToolbar = (props: LinkToolbarProps) => {

  const { editor } = props

  const [showEdit] = useState(false)
  const [linkInfo, setLinkInfo] = useState<LinkInfo>({
    href: '',
    text: '',
    target: ''
  })

  const updateLinkState = useCallback(() => {
    const { from, to } = editor.state.selection
    const { href, target } = editor.getAttributes('link')
    const text = editor.state.doc.textBetween(from, to, ' ')
    setLinkInfo({ href, target, text })
  }, [editor])

  const shouldShowEdit = useCallback(
    ({ editor, from, to }: ShouldShowProps) => {
      if (from === to) {
        return false
      }

      const { href } = editor.getAttributes('link')

      if (!editor.isActive('link') || !editor.isEditable) {
        return false
      }

      if (href) {
        updateLinkState()
        return true
      }
      return false
    }
    , [updateLinkState])

  const handleCopy = () => {
    copy(linkInfo.href)
    toast('Link copied to clipboard', {
      position: 'top-right'
    })

  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShowEdit}
    >
      {
        showEdit ? (
          <div></div>
        ) : (
          <div className="overflow-hidden rounded-md bg-background py-2 px-4 shadow-lg inset-shadow-2xs ">
            <div className="grid grid-flow-col items-center space-x-3 text-sm">
              <div className="grid grid-flow-col items-center space-x-1 text-gray-600">
                <Link2 className="size-4 mt-0.5" />
                <div>{linkInfo.text}</div>
              </div>
              <Copy className="size-4 mt-0.5 cursor-pointer" onClick={handleCopy} />
              <Edit className="size-4 mt-0.5 cursor-pointer" />
            </div>
          </div>
        )
      }
    </BubbleMenu>
  )
}