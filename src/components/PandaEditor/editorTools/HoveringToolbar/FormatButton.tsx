import { isMarkActive, toggleMark } from "../../util"
import { useSlateStatic } from "slate-react"
import ItemContainer from "./ItemContainer"


export function FormatButton(props: { format: string, children: React.ReactNode }) {
  const { format, children } = props
  const editor = useSlateStatic()

  return (
    <ItemContainer
      style={{
        // width: '28px',
        // height: '28px',
        color: isMarkActive(editor, format) ? '#2383e2' : '#32302c'
      }}
      onClick={() => toggleMark(editor, format)}
    >
      {children}
    </ItemContainer>
  )
}

