import { BubbleMenu, useEditorState } from "@tiptap/react"
import type { Editor } from '@tiptap/react'
import { useCallback, useState } from "react"
import { LinkInfo } from "./types"
import { LinkEditPanel } from "./link-edit-panel"
import { LinkToolbarContent } from "./link-toolbar-content"

interface LinkToolbarProps {
  editor: Editor
}
export const LinkToolbar = (props: LinkToolbarProps) => {
  const { editor } = props

  const [showEdit, setShowEdit] = useState(false)

  const linkInfo = useEditorState({
    editor,
    selector: ctx => {
      const { href = '', target = '' } = ctx.editor.getAttributes('link')
      return {
        href,
        target
      }
    }
  })

  const shouldShow = useCallback(
    () => {
      return editor.isActive('link')
    },
    [editor]
  )

  const onSetLink = useCallback(
    (value: LinkInfo) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink(value)
        .run()
      setShowEdit(false)
    },
    [editor]
  )

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}

      tippyOptions={{
        popperOptions: {
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                padding: 8,
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ],
        },
        onShown: (instance) => {
          setTimeout(() => {
            instance.popperInstance?.update()
          }, 300)
        },
        onHidden: () => setShowEdit(false),
      }}
    >
      <div className="rounded-md bg-background">
        {
          showEdit ? (
            <LinkEditPanel
              className="w-full min-w-96 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
              initialUrl={linkInfo.href}
              initialTarget={linkInfo.target}
              onSave={onSetLink}
            />
          ) : (
            <LinkToolbarContent
              editor={editor}
              linkInfo={linkInfo}
              setShowEdit={setShowEdit}
            />
          )
        }
      </div>

    </BubbleMenu >
  )
}