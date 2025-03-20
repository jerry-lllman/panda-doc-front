import { RenderLeafProps } from "slate-react"

export default function Leaf(props: RenderLeafProps) {
  const { attributes, children, leaf } = props

  const styles: React.CSSProperties = {}
  if (leaf.bold) {
    styles.fontWeight = 'bold'
  }

  if (leaf.italic) {
    styles.fontStyle = 'italic'
  }

  if (leaf.underlined) {
    styles.textDecoration = 'underline'
    styles.textUnderlineOffset = '0.2em'
    styles.textDecorationSkipInk = 'none'
  }

  if (leaf.strikethrough) {
    styles.textDecoration = styles.textDecoration ? `${styles.textDecoration} line-through` : 'line-through'
  }

  return <span {...attributes} style={styles}>{children}</span>
}
