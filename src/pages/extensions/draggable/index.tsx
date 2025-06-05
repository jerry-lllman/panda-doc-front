import type { Editor } from "@tiptap/react"
import { DragHandle } from "./drag-handle-react"
import { useData } from "@/pages/hooks/useData"
import { GripVertical } from "lucide-react"
import { Button } from "antd"

export const DragHandleComponent = (props: {
  editor: Editor
}) => {
  const { editor } = props

  const data = useData()

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 99,
      }}
    >
      <Button type="text" icon={<GripVertical className="select-none cursor-pointer" size={16} />} />
    </DragHandle>
  )
}