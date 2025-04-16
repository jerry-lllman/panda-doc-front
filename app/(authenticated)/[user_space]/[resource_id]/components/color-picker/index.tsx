import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipButton } from ".."
import { Palette } from "lucide-react"
import { COLORS } from "./constants"
import { useState } from "react"

interface ColorPickerProps {
  currentColor?: string
  currentHighlight?: string
  onColor: (color: string) => void
  onHighlight: (color: string) => void
}

export const ColorPicker = (props: ColorPickerProps) => {

  const { currentColor, currentHighlight, onColor, onHighlight } = props

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <TooltipButton
          tooltip="Text color"
          className="w-auto px-2"
          style={{
            color: currentColor,
            backgroundColor: currentHighlight
          }}
          onClick={() => setOpen(!open)}
        >
          <Palette />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent asChild className="w-auto" align="start" side="top" alignOffset={-20} onPointerDownOutside={() => setOpen(false)}>
        <div className="bg-background">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs">Text color</div>
              <div className="grid gap-2 grid-cols-5 mt-2">
                {
                  COLORS.map((color, index) => (
                    <TooltipButton
                      key={index}
                      tooltip={`${color.label} text`}
                      onClick={() => onColor(color.text)}>
                      <div className="w-7 h-7 leading-none grid place-center" >
                        <div
                          className="w-full h-auto grid place-items-center box-border border rounded"
                          style={{
                            color: color.text,
                            borderWidth: currentColor === color.text ? 2 : 1,
                            borderColor: currentColor === color.text ? color.text : "",
                          }}
                        >
                          A
                        </div>
                      </div>
                    </TooltipButton>
                  ))
                }
              </div>
            </div>
            <div>
              <div className="text-xs">Background color</div>
              <div className="grid gap-2 grid-cols-5 mt-2">
                {
                  COLORS.map((color, index) => {
                    return (
                      <TooltipButton
                        key={index}
                        tooltip={`${color.label} background`}
                        onClick={() => onHighlight(color.background)}
                      >
                        <div
                          className="w-7 h-7 box-border border rounded"
                          style={{
                            backgroundColor: color.background,
                            borderWidth: currentHighlight === color.background ? 2 : 1,
                            borderColor: currentHighlight === color.background ? color.text : "",
                          }}
                        >
                          <div className="w-full h-auto"></div>
                        </div>
                      </TooltipButton>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}