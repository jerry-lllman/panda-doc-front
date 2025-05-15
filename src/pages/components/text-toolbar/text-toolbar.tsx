import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEditorContentStates } from "../../hooks/use-editor-states"
import { BoldOutlined, ItalicOutlined, StrikethroughOutlined, UnderlineOutlined } from "@ant-design/icons"
import { Code } from "lucide-react"
import { useEditorCommands } from "../../hooks/use-editor-commands"
import { TooltipButton } from "../tooltip-button"
import { useEditorContentTypes } from "../../hooks/use-editor-content-types"
import { ContentTypePicker } from "./components/content-type-picker"
import { memo, useEffect, useState } from "react"
import { LinkPopover } from "../link"
import { getShortcutKey } from "@/utils/keyboard"
import { ColorPicker } from "./components/color-picker"
import { cn } from "@/utils/cn"
// import { offset } from '@floating-ui/dom'

const MemoTooltipButton = memo(TooltipButton)
const MemoContentTypePicker = memo(ContentTypePicker)
const MemoLinkPopover = memo(LinkPopover)
const MemoColorPicker = memo(ColorPicker)

const getShortcut = (keys: string[]) => keys.map(s => getShortcutKey(s).symbol).join('')

interface TextToolbarProps {
  editor: Editor
}
export const TextToolbar = (props: TextToolbarProps) => {

  const { editor } = props

  const [selecting, setSelecting] = useState(false)

  const states = useEditorContentStates(editor)
  const commands = useEditorCommands(editor)
  const options = useEditorContentTypes(editor)

  useEffect(() => {
    let selectionTimeout: number
    const onSelect = () => {
      setSelecting(true)

      if (selectionTimeout) {
        clearTimeout(selectionTimeout)
      }

      selectionTimeout = window.setTimeout(() => {
        setSelecting(false)
      }, 500)
    }

    editor.on('selectionUpdate', onSelect)

    return () => {
      editor.off('selectionUpdate', onSelect)
    }

  }, [editor])


  return (
    <BubbleMenu
      className={cn(selecting ? 'hidden' : '',)}
      options={{
        autoPlacement: true,
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
    >
      {states.showContent && (
        <div
          className="grid grid-flow-col bg-background rounded-xl shadow-md px-2 py-1"
          style={{
            boxShadow: `rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px`
          }}
        >
          <MemoContentTypePicker
            options={options}
          />
          <MemoTooltipButton
            tooltip={
              <div>
                <div>Bold</div>
                <div>{getShortcut(['mod', 'B'])}</div>
              </div>
            }
            isActive={states.isBold}
            onClick={commands.onBold}
          >
            <BoldOutlined />
          </MemoTooltipButton>
          <MemoTooltipButton
            tooltip={
              <div>
                <div>Italicize</div>
                <div>{getShortcut(['mod', 'I'])}</div>
              </div>
            }
            isActive={states.isItalic}
            onClick={commands.onItalic}
          >
            <ItalicOutlined />
          </MemoTooltipButton>
          <MemoTooltipButton
            tooltip={
              <div>
                <div>Underline</div>
                <div>{getShortcut(['mod', 'U'])}</div>
              </div>
            }
            isActive={states.isUnderline}
            onClick={commands.onUnderline}
          >
            <UnderlineOutlined />
          </MemoTooltipButton>
          <MemoTooltipButton
            tooltip={
              <div>
                <div>Strike-through</div>
                <div>{getShortcut(['mod', 'shift', 'S'])}</div>
              </div>
            }
            isActive={states.isStrike}
            onClick={commands.onStrike}
          >
            <StrikethroughOutlined />
          </MemoTooltipButton>
          <MemoTooltipButton
            tooltip={
              <div>
                <div>Code</div>
                <div>{getShortcut(['mod', 'E'])}</div>
              </div>
            }
            isActive={states.isCode}
            onClick={commands.onCode}
          >
            <Code size={14} />
          </MemoTooltipButton>
          <MemoLinkPopover onLink={commands.onLink} />
          <MemoColorPicker
            currentColor={states.currentColor}
            currentHighlight={states.currentHighlight}
            onColor={commands.onColor}
            onHighlight={commands.onHighlight}
          />
        </div>)}
    </BubbleMenu>
  )
}