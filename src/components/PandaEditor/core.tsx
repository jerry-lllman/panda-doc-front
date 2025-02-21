import { useEffect, useMemo } from "react"
import { YjsEditor } from "@slate-yjs/core"
import { createEditor, Descendant, Editor, Transforms } from "slate"
import { Editable, Slate, withReact } from "slate-react"
import { WebsocketProvider } from "y-websocket"
import * as Y from 'yjs'
import { Cursors } from "../Cursors"
import { getPandaEditorFns } from "./util"

const USER_COLORS = [
  "#1a1c2c",
  "#5d275d",
  "#b13e53",
  "#ef7d57",
  "#ffcd75",
  "#a7f070",
  "#38b764",
  "#257179",
  "#29366f",
  "#3b5dc9",
  "#41a6f6",
  "#73eff7",
  "#f4f4f4",
  "#94b0c2",
  "#566c86",
  "#333c57"
];


interface PandaEditorCoreProps {
  initialValue: Descendant[],
  needSyncDoc: boolean,
  sharedType: Y.XmlText,
  provider: WebsocketProvider
  userName?: string
}

export default function PandaEditorCore(props: PandaEditorCoreProps) {

  const { needSyncDoc, sharedType, provider, userName, initialValue } = props

  const { withYjs, withCursors } = getPandaEditorFns(needSyncDoc)

  const editor = useMemo(() => {
    const e = withReact(
      withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
        data: {
          name: userName,
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


  useEffect(() => {
    if (!needSyncDoc) return

    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor, needSyncDoc])

  return (
    <div>
      <Slate editor={editor} initialValue={initialValue}>
        <Cursors>
          <Editable />
        </Cursors>
      </Slate>
    </div>
  )
}