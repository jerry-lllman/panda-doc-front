import { BubbleMenu, Editor } from "@tiptap/react"
import { useEditorContentStates } from "../../hooks/use-editor-states"
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react"
import { useEditorCommands } from "../../hooks/use-editor-commands"
import { TooltipButton } from "../tooltip-button"
import { useEditorContentTypes } from "../../hooks/use-editor-content-types"
import { ContentTypePicker } from "./components/content-type-picker"
import { memo, useEffect, useState } from "react"
import { LinkButton } from "../link"
import { getShortcutKey } from "../../utils"
import { ColorPicker } from "./components/color-picker"

const MemoTooltipButton = memo(TooltipButton)
const MemoContentTypePicker = memo(ContentTypePicker)
const MemoLinkButton = memo(LinkButton)
const MemoColorPicker = memo(ColorPicker)

const getShortcut = (keys: string[]) => keys.map(s => getShortcutKey(s).symbol).join('')

interface TextToolbarProps {
  editor: Editor
  states: ReturnType<typeof useEditorContentStates>
  commands: ReturnType<typeof useEditorCommands>
}
export const TextToolbar = (props: TextToolbarProps) => {

  const { editor, states, commands } = props

  const options = useEditorContentTypes(editor)

  const [selecting, setSelecting] = useState(false)

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
      pluginKey='textToolbar'
      editor={editor}
      className={selecting ? 'hidden' : ''}
      shouldShow={states.shouldShow}
      tippyOptions={{
        popperOptions: {
          placement: 'top-start',
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8,
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
              },
            },
          ],
        },
        offset: [0, 8],
        maxWidth: 'calc(100vw - 16px)',
        onShown: (instance) => {
          setTimeout(() => {
            instance.popperInstance?.update()
          }, 300)
        },
      }}
    >
      <div className="grid grid-flow-col bg-background rounded-xl shadow-md px-2 py-1" style={{
        boxShadow: `rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px`
      }}>
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
          <Bold />
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
          <Italic />
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
          <Underline />
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
          <Strikethrough />
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
          <Code />
        </MemoTooltipButton>
        <MemoLinkButton getCurrentLink={states.getCurrentLink} onLink={commands.onLink} />
        <MemoColorPicker
          currentColor={states.currentColor}
          currentHighlight={states.currentHighlight}
          onColor={commands.onColor}
          onHighlight={commands.onHighlight}
        />
      </div>
    </BubbleMenu>
  )
}