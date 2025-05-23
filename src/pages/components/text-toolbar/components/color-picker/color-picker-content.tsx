import { useCallback } from "react"
import { TooltipButton } from "../../../tooltip-button"
import { COLORS } from "./constants"
import { Editor } from "@tiptap/react"

interface ColorPickerContentProps {
  editor: Editor
  currentColor?: string
  currentBgColor?: string
}
export const ColorPickerContent = (props: ColorPickerContentProps) => {

  const { editor, currentColor, currentBgColor } = props

  const handlerColorChange = useCallback((e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault()
    e.stopPropagation()
    editor.chain().focus().setColor(value).run()
  }, [editor])

  const handlerBackgroundChange = useCallback((e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault()
    e.stopPropagation()
    editor.chain().focus().setHighlight({ color: value }).run()
  }, [editor])

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <div className="text-xs">Text color</div>
        <div className="grid gap-2 grid-cols-5 mt-2">
          {
            COLORS.map((color, index) => (
              <TooltipButton
                key={index}
                tooltip={`${color.label} text`}
                tooltipProps={{
                  defaultOpen: false
                }}
                onClick={e => handlerColorChange(e, color.text)}>
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
                  onClick={e => handlerBackgroundChange(e, color.background)}
                >
                  <div
                    className="w-7 h-7 box-border border rounded"
                    style={{
                      backgroundColor: color.background,
                      borderWidth: currentBgColor === color.background ? 2 : 1,
                      borderColor: currentBgColor === color.background ? color.text : "",
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
  )
}