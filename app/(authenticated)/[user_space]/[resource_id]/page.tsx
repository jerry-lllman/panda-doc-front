"use client"

import { DocEditor } from "./doc-editor"
import { usePandaEditor } from "./hooks/use-panda-editor"

// import { useParams } from "next/navigation"
export default function ResourcePage() {
  // const { resource_id: resourceId } = useParams()
  const { editor } = usePandaEditor()

  if (!editor) {
    return null
  }

  return (
    <div>
      <DocEditor editor={editor} />
    </div>
  )
} 
