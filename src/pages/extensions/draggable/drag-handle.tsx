import type { Editor } from "@tiptap/react"
import { DragHandle } from "./drag-react"
import { useData } from "@/pages/hooks/useData"
import { GripVertical } from "lucide-react"

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
      <GripVertical className="select-none cursor-pointer" />
    </DragHandle>
  )
}