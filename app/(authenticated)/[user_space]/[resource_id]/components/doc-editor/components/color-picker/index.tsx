import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipButton } from ".."
import { Editor } from "@tiptap/react"
import { ColorPickerContent } from './color-picker-content'
import { Palette } from "lucide-react"

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
          className="w-auto px-2"
          style={{
            color: currentColor,
            backgroundColor: currentBgColor
          }}
        >
          <Palette />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start" alignOffset={-20}  >
        <div className="bg-background">
          <ColorPickerContent
            editor={editor}
            currentColor={currentColor}
            currentBgColor={currentBgColor}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}