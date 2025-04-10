import { useCallback } from "react"
import { TooltipButton } from "../tooltip-button"
import { COLORS } from "./constants"
import { Editor } from "@tiptap/react"

interface ColorPickerContentProps {
  editor: Editor
}
export const ColorPickerContent = (props: ColorPickerContentProps) => {

  const { editor } = props

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