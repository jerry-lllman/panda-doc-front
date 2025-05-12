import type { Editor } from '@tiptap/react'
import { Copy, Edit, Unlink } from "lucide-react"
import copy from 'copy-to-clipboard'
import { message } from "antd"
import type { LinkInfo } from "./types"
import { TooltipButton } from ".."
import { Link } from "react-router-dom"

interface LinkToolbarProps {
  editor: Editor
  linkInfo: LinkInfo
  setShowEdit: (show: boolean) => void
}
export const LinkToolbarContent = (props: LinkToolbarProps) => {

  const { editor, linkInfo, setShowEdit } = props

  const handleCopy = () => {
    copy(linkInfo.href)
    message.success('Link copied to clipboard')
  }
  const onUnsetLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  return (
    <div className="inline-flex items-center gap-1 text-sm  ">
      <div className="grid grid-flow-col items-center space-x-1 text-gray-600">
        {/* <LinkIcon className="size-4 mt-0.5" /> */}
        <Link to={linkInfo.href} target="_blank" rel="noopener noreferrer" className=' break-all underline'>{linkInfo.href}</Link>
      </div>
      {/* <Separator orientation="vertical" className='h-4' /> */}
      <TooltipButton tooltip="Copy" onClick={handleCopy}>
        <Copy className="size-4" />
      </TooltipButton>
      {/* <Separator orientation="vertical" /> */}
      <TooltipButton tooltip="Edit link" onClick={() => setShowEdit(true)} >
        <Edit className="size-4" />
      </TooltipButton>
      {/* <Separator orientation="vertical" /> */}
      <TooltipButton tooltip="Clear link" onClick={onUnsetLink} >
        <Unlink className="size-4" />
      </TooltipButton>
    </div>
  )
}