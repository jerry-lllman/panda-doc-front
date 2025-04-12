import { BubbleMenu, Editor } from "@tiptap/react"
import { useTextToolbarStates } from "./hooks/use-text-toolbar-states"
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react"
import { useTextToolbarCommands } from "./hooks/use-text-toolbar-commands"
import { TooltipButton } from "../tooltip-button"

interface TextToolbarProps {
  editor: Editor
}
export const TextToolbar = (props: TextToolbarProps) => {

  const { editor } = props

  const states = useTextToolbarStates(editor)
  const commands = useTextToolbarCommands(editor)

  return (
    <BubbleMenu
      pluginKey='textToolbar'
      editor={editor}
      shouldShow={states.shouldShow}
    >
      <div className="bg-background rounded-xl shadow-md px-2 py-1" style={{
        boxShadow: `rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px`
      }}>
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
      </div>
    </BubbleMenu>
  )
}