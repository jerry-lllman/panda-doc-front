import { Editor } from "@tiptap/react"
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react"
import { FormatAction } from "../../types"
import { TooltipButton } from ".."
import { getShortcutKey } from "../../utils"
import { VariantProps } from "class-variance-authority"
import { toggleVariants } from "@/components/ui/toggle"
import { useMemo } from "react"

export type TextStyleAction = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link' | 'clearFormatting'

interface TextStyle extends FormatAction {
  value: TextStyleAction
}

const formatActions: TextStyle[] = [
  {
    value: 'bold',
    label: 'Bold',
    icon: <Bold />,
    action: editor => editor.chain().focus().toggleBold().run(),
    isActive: editor => editor.isActive('bold'),
    canExecute: editor => editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'B']
  },
  {
    value: 'italic',
    label: 'Italicize',
    icon: <Italic />,
    action: editor => editor.chain().focus().toggleItalic().run(),
    isActive: editor => editor.isActive('italic'),
    canExecute: editor => editor.can().chain().focus().toggleItalic().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'I']
  },
  {
    value: 'underline',
    label: 'Underline',
    icon: <Underline />,
    action: editor => editor.chain().focus().toggleUnderline().run(),
    isActive: editor => editor.isActive('underline'),
    canExecute: editor => editor.can().chain().focus().toggleUnderline().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'I']
  },
  {
    value: 'strikethrough',
    label: 'Strike-through',
    icon: <Strikethrough />,
    action: editor => editor.chain().focus().toggleStrike().run(),
    isActive: editor => editor.isActive('strike'),
    canExecute: editor => editor.can().chain().focus().toggleStrike().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'shift', 'S']
  },
  {
    value: 'code',
    label: 'Code',
    icon: <Code />,
    action: editor => editor.chain().focus().toggleCode().run(),
    isActive: editor => editor.isActive('code'),
    canExecute: editor => editor.can().chain().focus().toggleCode().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'E']
  },

  // {
  //   value: 'clearFormatting',
  //   label: 'Clear Formatting',
  //   icon: <Eraser />,
  //   action: editor => editor.chain().focus().toggleMark('strikethrough'),
  //   isActive: editor => editor.isActive('strikethrough'),
  //   canExecute: editor => editor.can().chain().focus().unsetAllMarks() && !editor.isActive('codeBlock'),
  //   shortcuts: ['mod', '\\']
  // },

]


interface ToolbarFormatProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  items: TextStyleAction[]
}

export const ToolbarFormat = (props: ToolbarFormatProps) => {
  const { editor, items = [], variant } = props

  const renderActions = useMemo(() => {
    return formatActions
      .filter(actionItem => items.includes(actionItem.value))
      .sort((a, b) => items.indexOf(a.value) - items.indexOf(b.value))
  }, [items])

  return (
    <div className="inline-grid grid-flow-col">
      {renderActions.map((action, index) => (
        <TooltipButton
          key={index}
          onClick={() => action.action(editor)}
          disabled={!action.canExecute(editor)}
          isActive={action.isActive(editor)}
          tooltip={
            <div>
              <div>{action.label}</div>
              <div>{action.shortcuts.map(s => getShortcutKey(s).symbol).join('')}</div>
            </div>
          }
          aria-label={action.label}
          variant={variant}
        >
          {action.icon}
        </TooltipButton>
      ))}
    </div>
  )
}
