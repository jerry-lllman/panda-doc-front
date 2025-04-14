import { BubbleMenu, Editor } from "@tiptap/react"
import { useTextToolbarStates } from "./hooks/use-text-toolbar-states"
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react"
import { useTextToolbarCommands } from "./hooks/use-text-toolbar-commands"
import { TooltipButton } from "../tooltip-button"
import { useTextToolbarContentTypes } from "./hooks/use-text-toolbar-content-types"
import { ContentTypePicker } from "./components/content-type-picker"
import { useEffect, useState } from "react"
import { LinkButton } from "../link"

interface TextToolbarProps {
  editor: Editor
}
export const TextToolbar = (props: TextToolbarProps) => {

  const { editor } = props
  const [selecting, setSelecting] = useState(false)

  const states = useTextToolbarStates(editor)
  const commands = useTextToolbarCommands(editor)
  const options = useTextToolbarContentTypes(editor)

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
      updateDelay={0}
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
      }}
    >
      <div className="grid grid-flow-col bg-background rounded-xl shadow-md px-2 py-1" style={{
        boxShadow: `rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px`
      }}>
        <ContentTypePicker
          options={options}
        />
        <TooltipButton
          tooltip="Bold"
          onClick={commands.onBold}
        >
          <Bold />
        </TooltipButton>
        <TooltipButton
          tooltip="Italic"
          onClick={commands.onItalic}
        >
          <Italic />
        </TooltipButton>
        <TooltipButton
          tooltip="Underline"
          onClick={commands.onUnderline}
        >
          <Underline />
        </TooltipButton>
        <TooltipButton
          tooltip="Bold"
          onClick={commands.onStrike}
        >
          <Strikethrough />
        </TooltipButton>
        <TooltipButton
          tooltip="Code"
          onClick={commands.onCode}
        >
          <Code />
        </TooltipButton>
        <LinkButton linkInfo={states.currentLink} onLink={commands.onLink} />
      </div>
    </BubbleMenu>
  )
}