import { Heading, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Type } from "lucide-react";
import { FormatAction } from "../../../types"
import type { Level } from '@tiptap/extension-heading'
import { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipButton } from "../../tooltip-button";
import { VariantProps } from "class-variance-authority";
import { toggleVariants } from "@/components/ui/toggle";
import { useMemo } from "react";


type Enumerate<N extends number, Acc extends number[] = []> =
  Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> =
  Exclude<Enumerate<T>, Enumerate<F>> | T;

type Heading<N extends Level> = `h${Range<1, N>}`;

type HeadingType = Heading<6>;

type TextStyleAction = 'text' | HeadingType

interface BlockStyle extends Omit<FormatAction, 'canExecute'> {
  value: TextStyleAction
  level?: Level
  className?: string
}

const HeadingIcons = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6]

const generateHeadings = (maxLevel: Level) => {
  const headings: BlockStyle[] = []
  for (let i = 1; i <= maxLevel; i++) {
    const value = `h${i}` as HeadingType
    const label = `Heading ${i}`
    const HeadingIcon = HeadingIcons[i - 1]
    const action = (editor: Editor) => editor.chain().focus().toggleHeading({ level: i as Level }).run()
    const isActive = (editor: Editor) => editor.isActive('heading', { level: i })
    const shortcuts = ['mod', 'alt', String(i)]
    headings.push({
      value,
      label,
      icon: <HeadingIcon className="size-5" />,
      action,
      isActive,
      shortcuts,
    })
  }
  return headings
}

const blockTypes: BlockStyle[] = [
  {
    value: 'text',
    label: 'Text',
    icon: <Type className="size-5" />,
    action: editor => editor.chain().focus().setParagraph().run(),
    isActive: editor => editor.isActive('text'),
    shortcuts: ['mod', '0'],
  },
  ...generateHeadings(6),
]

interface BlockTypeSelectorProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const BlockTypeSelector = (props: BlockTypeSelectorProps) => {

  const { editor, variant } = props

  const getBlockType = useMemo(() => {
    const node = editor.state.selection.$from.parent
    const nodeTypeName = node.type.name
    let result = nodeTypeName === 'heading' ? `Heading ${node.attrs.level}` : nodeTypeName
    if (result === 'paragraph') {
      result = 'Text'
    }
    return result
  }, [editor])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          tooltip="Turn into"
          aria-label="Turn into"
          className="w-auto px-2"
          variant={variant}
        >
          {getBlockType}
        </TooltipButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-gray-400">Turn into</DropdownMenuLabel>
        <DropdownMenuGroup>
          {
            blockTypes.map((item) => (
              <DropdownMenuItem
                key={item.value}
                className="h-9 items-center cursor-pointer"
                onClick={() => item.action(editor)}
              >
                {item.icon}
                {item.label}
                <DropdownMenuShortcut>{item.shortcuts.join('+')}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



