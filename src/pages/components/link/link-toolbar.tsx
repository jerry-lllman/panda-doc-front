import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from '@tiptap/react'
import { useCallback, useRef, useState } from "react"
import type { LinkInfo } from "./types"
import { LinkEditPanel } from "./link-edit-panel"
import { LinkToolbarContent } from "./link-toolbar-content"
import { Card } from "antd"

interface LinkToolbarProps {
  editor: Editor
}

// 创建类型安全的实例类型，使用必要的属性
type TippyInstance = {
  popperInstance?: {
    update: () => void;
  };
};

export const LinkToolbar = (props: LinkToolbarProps) => {
  const { editor } = props

  const [showEdit, setShowEdit] = useState(false)

  const linkInfo = useEditorState({
    editor,
    selector: ctx => {
      const { href = '' } = ctx.editor.getAttributes('link')
      return {
        href,
      }
    }
  })

  const shouldShow = useCallback(
    () => {
      return editor.isActive('link')
    },
    [editor]
  )


  const menuRef = useRef<TippyInstance | null>(null)
  const onSetShowEdit = useCallback((value: boolean) => {
    setShowEdit(value)
    // Fix the menu position
    menuRef.current?.popperInstance?.update()
  }, [])

  const onSetLink = useCallback(
    (value: LinkInfo) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink(value)
        .run()
      onSetShowEdit(false)
    },
    [editor, onSetShowEdit]
  )



  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}

    >
      <Card size='small' className="bg-background !max-w-[350px]">
        {
          showEdit ? (
            <LinkEditPanel
              className="w-full bg-popover text-popover-foreground outline-none"
              initialUrl={linkInfo.href}
              // initialTarget={linkInfo.target}
              onSave={onSetLink}
            />
          ) : (
            <LinkToolbarContent
              editor={editor}
              linkInfo={linkInfo}
              setShowEdit={onSetShowEdit}
            />
          )
        }
      </Card>

    </BubbleMenu >
  )
}