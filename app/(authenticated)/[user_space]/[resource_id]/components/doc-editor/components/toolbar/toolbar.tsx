import { toggleVariants } from "@/components/ui/toggle"
import { Editor } from "@tiptap/react"
import { VariantProps } from "class-variance-authority"
import { TextStyleAction, ToolbarFormat } from "./toolbar-format"
import { LinkButton } from "../link"
import { BlockTypeSelector } from "./block-type-selector"

interface ToolbarBaseProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  items: TextStyleAction[]
}


export const ToolbarBase = (props: ToolbarBaseProps) => {

  const { editor, variant, items } = props

  return (
    <div className="inline-grid grid-flow-col">
      <ToolbarFormat editor={editor} variant={variant} items={items} />
      <LinkButton editor={editor} variant={variant} />
      <BlockTypeSelector editor={editor} variant={variant} />

    </div>
  )
}