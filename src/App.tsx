import { useEffect, useMemo, useState } from "react"

import { createEditor, Descendant, Editor, Transforms } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket"
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core"
import { Cursors } from "./components"
import { USER_COLORS } from "./constants"
// import { useSearchParams } from "react-router"

const defaultInitialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph' }]
  }
]

export default function App() {

  // const [searchParams] = useSearchParams()

  const searchParams = new URLSearchParams(location.search)

  const docId = searchParams.get('docId') || ''
  const userId = searchParams.get('userId') || ''

  return <CollaborativeEditor docId={docId} userId={userId} />

}

interface CollaborativeEditorProps {
  docId: string
  userId: string
}

const CollaborativeEditor = (props: CollaborativeEditorProps) => {

  const { docId, userId } = props

  const [connected, setConnected] = useState(false)
  const [sharedType, setSharedType] = useState<Y.XmlText>()
  const [provider, setProvider] = useState<WebsocketProvider>()

  useEffect(() => {

    if (!docId || !userId) {
      return
    }

    const yDoc = new Y.Doc()
    const yProvider = new WebsocketProvider('ws', `doc-room?docId=${docId}&userId=${userId}`, yDoc);

    const sharedDoc = yDoc.get('slate', Y.XmlText)

    yProvider.on('sync', setConnected)
    setSharedType(sharedDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.off('sync', setConnected)
      yProvider?.destroy()
    }
  }, [])

  if (!connected || !sharedType || !provider) {
    return <div>Loading...</div>
  }

  return <SlateEditor sharedType={sharedType} provider={provider} userId={userId} />

}

const SlateEditor = ({ sharedType, provider, userId }: { sharedType: Y.XmlText, provider: WebsocketProvider, userId: string }) => {
  // const [editor] = useState(() => withReact(createEditor()))
  const editor = useMemo(() => {

    const e = withReact(
      withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
        data: {
          name: userId,
          color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
        }
      })
    )

    const { normalizeNode } = e

    e.normalizeNode = entry => {
      const [node] = entry

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry)
      }

      Transforms.insertNodes(editor, initialValue, { at: [0] })
    }

    return e
  }, [])

  const initialValue = useMemo(() => {
    // const content = localStorage.getItem('content')
    // return content ? JSON.parse(content) : defaultInitialValue

    return defaultInitialValue
  }, [])

  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Cursors>
        <Editable />
      </Cursors>
    </Slate>
  )
}