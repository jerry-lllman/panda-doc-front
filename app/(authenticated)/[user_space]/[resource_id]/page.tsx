"use client"

import { DocEditor } from "./components"

// import { useParams } from "next/navigation"
export default function ResourcePage() {
  // const { resource_id: resourceId } = useParams()

  return (
    <div className="px-4">
      <DocEditor />
    </div>
  )
} 
