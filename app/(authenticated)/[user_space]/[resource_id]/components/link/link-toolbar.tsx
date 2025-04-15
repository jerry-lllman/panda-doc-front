import { BubbleMenu } from "@tiptap/react"
import type { Editor } from '@tiptap/react'
import { useCallback, useState } from "react"
import { ShouldShowProps, LinkInfo } from "./types"
import { LinkEditBlock } from "./link-edit-block"
import { LinkToolbarContent } from "./link-toolbar-content"
import { useEditorContentStates } from "../../hooks/use-editor-states"
import { useEditorCommands } from "../../hooks/use-editor-commands"

interface LinkToolbarProps {
  editor: Editor
  states: ReturnType<typeof useEditorContentStates>
  commands: ReturnType<typeof useEditorCommands>
}
export const LinkToolbar = (props: LinkToolbarProps) => {
  const { editor, states, commands } = props

  const [showEdit, setShowEdit] = useState(false)
  const [linkInfo, setLinkInfo] = useState<LinkInfo>({
    href: '',
    text: '',
    target: ''
  })

  const updateLinkState = useCallback(() => {
    const { href = '', target = '', text = '' } = states.getCurrentLink() || {}
    setLinkInfo({ href, target, text })
  }, [states])

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

      commands.onLink(value)

      setShowEdit(false)
      updateLinkState()
    },
    [commands, updateLinkState]
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