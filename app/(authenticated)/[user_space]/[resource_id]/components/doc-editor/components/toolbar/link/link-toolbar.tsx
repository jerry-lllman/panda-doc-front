import { BubbleMenu } from "@tiptap/react"
import type { Editor } from '@tiptap/react'
import { useCallback, useState } from "react"
import { ShouldShowProps } from "../../../types"
import { Copy, Edit, Link, Unlink } from "lucide-react"
import copy from 'copy-to-clipboard'
import { toast } from "sonner"
import { LinkEditBlock } from "./link-edit-block"
import { LinkInfo } from "./type"
import { TooltipButton } from "../../"
import { Separator } from "@/components/ui/separator"

interface LinkToolbarProps {
  editor: Editor
}
export const LinkToolbar = (props: LinkToolbarProps) => {

  const { editor } = props

  const [showEdit, setShowEdit] = useState(false)
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
    },
    [updateLinkState]
  )

  const handleCopy = () => {
    copy(linkInfo.href)
    toast.success('Link copied to clipboard', {
      position: 'bottom-center'
    })
  }

  const onSetLink = useCallback(
    (value: LinkInfo) => {
      const { text, href, target } = value
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .insertContent({
          type: 'text',
          text: text || href,
          marks: [
            {
              type: 'link',
              attrs: {
                href,
                target
              }
            }
          ]
        })
        .setLink(value)
        .run()
      setShowEdit(false)
      updateLinkState()
    },
    [editor, updateLinkState]
  )

  const onUnsetLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShowEdit}
      tippyOptions={{
        maxWidth: 'auto',
        placement: 'bottom-start',
        onHidden: () => setShowEdit(false),
      }}
    >
      <div className="rounded-md bg-background">
        {
          showEdit ? (
            <LinkEditBlock
              className="w-full min-w-96 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
              defaultValues={linkInfo}
              onSave={onSetLink}
            />
          ) : (
            <div
              // className="overflow-hidden  bg-background py-1 px-4 shadow-lg inset-shadow-2xs "
              className="flex h-10 overflow-hidden rounded-md bg-background p-2  shadow-lg inset-shadow-2xs pl-3 pr-1  "
            >
              <div className="inline-flex  items-center gap-1 text-sm">
                <div className="grid grid-flow-col items-center space-x-1 text-gray-600">
                  <Link className="size-4 mt-0.5" />
                  <div>{linkInfo.text}</div>
                </div>
                <Separator orientation="vertical" />
                <TooltipButton tooltip="Copy" onClick={handleCopy}>
                  <Copy className="size-4" />
                </TooltipButton>
                <Separator orientation="vertical" />
                <TooltipButton tooltip="Edit link" onClick={() => setShowEdit(true)} >
                  <Edit className="size-4" />
                </TooltipButton>
                <Separator orientation="vertical" />
                <TooltipButton tooltip="Clear link" onClick={onUnsetLink} >
                  <Unlink className="size-4" />
                </TooltipButton>
              </div>
            </div>
          )
        }
      </div>

    </BubbleMenu >
  )
}