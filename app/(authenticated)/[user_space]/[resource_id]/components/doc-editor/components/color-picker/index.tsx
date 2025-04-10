import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipButton } from ".."
import { Editor } from "@tiptap/react"
import { memo } from "react"
import { ColorPickerContent } from './color-picker-content'

const MemoPicker = memo(ColorPickerContent)

interface ColorPickerProps {
  editor: Editor
}

export const ColorPicker = (props: ColorPickerProps) => {

  const { editor } = props
  const currentColor = editor.getAttributes('textStyle')?.color
  const currentBgColor = editor.getAttributes('highlight')?.color

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipButton
          tooltip="Text color"
          style={{
            color: currentColor,
            backgroundColor: currentBgColor
          }}
        >
          A
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start" alignOffset={-20} asChild >
        <div className="bg-background">
          <MemoPicker editor={editor} />
        </div>
      </PopoverContent>
    </Popover>
  )
}