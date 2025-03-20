import { RenderElementProps } from "slate-react"


export default function CodeBlock(props: RenderElementProps) {


  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

CodeBlock.displayName = 'code-block' as const