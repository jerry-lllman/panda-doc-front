import type { Editor } from '@tiptap/react'
import { Copy, Edit, Link, Unlink } from "lucide-react"
import copy from 'copy-to-clipboard'
import { toast } from "sonner"
import { LinkInfo } from "./type"
import { TooltipButton } from "../"
import { Separator } from "@/components/ui/separator"

interface LinkToolbarProps {
  editor: Editor
  linkInfo: LinkInfo
  setShowEdit: (show: boolean) => void
}
export const LinkToolbarContent = (props: LinkToolbarProps) => {

  const { editor, linkInfo, setShowEdit } = props

  const handleCopy = () => {
    copy(linkInfo.href)
    toast.success('Link copied to clipboard', {
      position: 'bottom-center'
    })
  }
  const onUnsetLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  return (
    <div
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