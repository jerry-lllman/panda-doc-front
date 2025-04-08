import { toggleVariants } from "@/components/ui/toggle"
import { Editor } from "@tiptap/react"
import { VariantProps } from "class-variance-authority"
import { TextStyleAction, ToolbarFormat } from "./toolbar-format"
import { LinkButton } from "../link"
import { BlockTypeSelector } from "./block-type-selector"
import { ColorPicker } from "../color-picker"

interface ToolbarBaseProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  items: TextStyleAction[]
}


export const ToolbarBase = (props: ToolbarBaseProps) => {

  const { editor, variant, items } = props

  return (
    <div className="inline-grid grid-flow-col">
      <BlockTypeSelector editor={editor} variant={variant} />
      <ToolbarFormat editor={editor} variant={variant} items={items} />
      <LinkButton editor={editor} variant={variant} />
      <ColorPicker editor={editor} />
    </div>
  )
}