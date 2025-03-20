import { JSX, useEffect, useMemo, useState } from "react"
import { YjsEditor } from "@slate-yjs/core"
import { createEditor, Descendant, Editor, Transforms } from "slate"
import { Editable, Slate, withReact } from "slate-react"
import { WebsocketProvider } from "y-websocket"
import * as Y from 'yjs'
import { Cursors } from "../Cursors"
import { getPandaEditorFns, toggleMark } from "./util"
import { HoveringToolbar, LinkModal } from "./editorTools"
import { RenderElement, RenderLeaf } from "./editorRuntime"
import { OVERLAY_CONTAINER_ID } from "./constants"
import { css } from "@emotion/css"
import { createPortal } from "react-dom"

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


interface ConfigElementItem {
  key: string,
  element: JSX.ElementType
}

export interface PandaEditorCoreConfig {
  elements?: ConfigElementItem[]
}

interface PandaEditorCoreProps {
  initialValue: Descendant[],
  needSyncDoc: boolean,
  sharedType: Y.XmlText,
  provider: WebsocketProvider
  userName?: string
  config: PandaEditorCoreConfig
}

export default function PandaEditorCore(props: PandaEditorCoreProps) {

  const { needSyncDoc, sharedType, provider, userName, initialValue } = props

  const { withYjs, withCursors, withLink } = getPandaEditorFns(needSyncDoc)

  const editor = useMemo(() => {
    const e =
      withReact(
        withCursors(
          withYjs(
            withLink(
              createEditor()
            ),
            sharedType
          ),
          provider.awareness,
          {
            data: {
              name: userName,
              color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
            }
          }
        )

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
  }, [initialValue, provider.awareness, sharedType, userName, withCursors, withLink, withYjs])

  useEffect(() => {
    if (!needSyncDoc) return

    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor, needSyncDoc])

  const [domRange, setDomRange] = useState<Range | null>(null)

  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <div
        id="panda-editor-container"
        style={{ position: 'relative', margin: 40, border: '1px solid #ccc', height: '80vh', width: '90vh', overflow: 'auto' }}
        onScroll={() => {
          if (domRange) {
            setSelectionRect(domRange.getBoundingClientRect())
          }
        }}
      >
        <Cursors>
          <Editable
            onSelect={() => {
              const domSelection = window.getSelection()!
              const domRangeSelection = domSelection.getRangeAt(0)
              if (domRangeSelection.endOffset === domRangeSelection.startOffset) {
                setDomRange(null)
                setSelectionRect(null)
              } else {
                setDomRange(domRangeSelection)
                setSelectionRect(domRangeSelection.getBoundingClientRect())
              }
            }}

            renderLeaf={RenderLeaf}
            renderElement={RenderElement}
            onDOMBeforeInput={(event: InputEvent) => {
              // 键盘快捷事件
              switch (event.inputType) {
                case 'formatBold':
                  event.preventDefault()
                  return toggleMark(editor, 'bold')
                case 'formatItalic':
                  event.preventDefault()
                  return toggleMark(editor, 'italic')
                case 'formatUnderline':
                  event.preventDefault()
                  return toggleMark(editor, 'underlined')
                case 'formatStrikethrough':
                  event.preventDefault()
                  return toggleMark(editor, 'strikethrough')
              }
            }}
          />
        </Cursors>
      </div>
      {
        createPortal(
          <div
            id={OVERLAY_CONTAINER_ID}
            className={css`
                position: fixed;
                inset: 0;
                z-index: 999;
                pointer-events: none;
                overflow: hidden;
              `}
          >
            <HoveringToolbar style={{ zIndex: 1 }} selectionRect={selectionRect} />
            <LinkModal style={{ zIndex: 2 }} selectionRect={selectionRect} />
          </div>,
          document.getElementById('root')!
        )
      }
    </Slate>
  )
}
