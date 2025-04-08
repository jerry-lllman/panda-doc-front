import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipButton } from ".."
import { COLORS } from "./constants"
import { Editor } from "@tiptap/react"
import { useCallback } from "react"


interface ColorPickerProps {
  editor: Editor
}

export const ColorPicker = (props: ColorPickerProps) => {

  const { editor } = props

  const handlerColorChange = useCallback((e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault()
    editor.chain().setColor(value).run()
  }, [editor])

  const handlerBackgroundChange = useCallback((e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault()
    editor.chain().focus().toggleHighlight({ color: value }).run()
  }, [editor])

  return (
    <Popover >
      <PopoverTrigger asChild>
        <TooltipButton>
          A
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start" alignOffset={-20}>
        <div>
          <div>
            <div>Text color</div>
            <div className="grid gap-3 grid-cols-5 ">
              {
                COLORS.map((color, index) => (
                  <TooltipButton
                    key={index}
                    tooltip={`${color.label} text`}
                    onClick={e => handlerColorChange(e, color.text)}>
                    <div className="w-7 h-7 leading-none grid place-center" >
                      <div
                        className="w-full h-auto grid place-items-center border rounded"
                        style={{ color: color.text, }}
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
            <div>Background color</div>
            <div className="grid gap-3 grid-cols-5">
              {
                COLORS.map((color, index) => {
                  return (
                    <TooltipButton
                      key={index}
                      tooltip={`${color.label} background`}
                      onClick={e => handlerBackgroundChange(e, color.background)}
                    >
                      <div className="w-7 h-7 border rounded" style={{ backgroundColor: color.background }} >
                      </div>
                    </TooltipButton>
                  )
                })
              }
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}