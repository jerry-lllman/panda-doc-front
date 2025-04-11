import { BubbleMenu } from "@tiptap/react"
import type { Editor } from '@tiptap/react'
import { useCallback, useState } from "react"
import { ShouldShowProps, LinkInfo } from "./types"
import { LinkEditBlock } from "./link-edit-block"
import { LinkToolbarContent } from "./link-toolbar-content"

interface LinkToolbarProps {
  editor: Editor
}
export const LinkToolbar = (props: LinkToolbarProps) => {
  const { editor } = props

  const [showEdit, setShowEdit] = useState(false)
  const [linkInfo, setLinkInfo] = useState<LinkInfo>({
    href: '',
    text: '',
    target: ''
  })

  const updateLinkState = useCallback(() => {
    const { from, to } = editor.state.selection
    const { href, target } = editor.getAttributes('link')
    const text = editor.state.doc.textBetween(from, to, ' ')
    setLinkInfo({ href, target, text })
  }, [editor])

  const shouldShowEdit = useCallback(
    ({ editor, from, to }: ShouldShowProps) => {
      if (from === to) {
        return false
      }

      const { href } = editor.getAttributes('link')

      if (!editor.isActive('link') || !editor.isEditable) {
        return false
      }

      if (href) {
        updateLinkState()
        return true
      }
      return false
    },
    [updateLinkState]
  )

  const onSetLink = useCallback(
    (value: LinkInfo) => {
      const { text, href, target } = value
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .insertContent({
          type: 'text',
          text: text || href,
          marks: [
            {
              type: 'link',
              attrs: {
                href,
                target
              }
            }
          ]
        })
        .setLink(value)
        .run()
      setShowEdit(false)
      updateLinkState()
    },
    [editor, updateLinkState]
  )


  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShowEdit}
      tippyOptions={{
        maxWidth: 'auto',
        placement: 'bottom-start',
        onHidden: () => setShowEdit(false),
      }}
    >
      <div className="rounded-md bg-background">
        {
          showEdit ? (
            <LinkEditBlock
              className="w-full min-w-96 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
              defaultValues={linkInfo}
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