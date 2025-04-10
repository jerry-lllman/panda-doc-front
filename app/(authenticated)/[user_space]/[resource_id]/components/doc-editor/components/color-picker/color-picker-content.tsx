import { useCallback } from "react"
import { TooltipButton } from "../tooltip-button"
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
    editor.chain().setColor(value).run()
  }, [editor])

  const handlerBackgroundChange = useCallback((e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault()
    e.stopPropagation()
    editor.chain().focus().setHighlight({ color: value }).run()
  }, [editor])

  return (
    <div className="p-1">
      <div onClick={e => {
        e.stopPropagation()
        e.preventDefault()
      }}>
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
    </div>
  )
}