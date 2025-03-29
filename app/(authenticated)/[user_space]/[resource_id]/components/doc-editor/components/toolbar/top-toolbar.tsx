import { Editor } from "@tiptap/react"
import { TextStyleAction } from "./toolbar-format"
import { VariantProps } from "class-variance-authority"
import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/lib/utils";
import { ToolbarBase } from "./toolbar";
import { LinkToolbar } from "./link";

interface TopToolbarProps extends Partial<HTMLDivElement>, VariantProps<typeof toggleVariants> {
  editor: Editor;
  items: TextStyleAction[];
}

export const TopToolbar = (props: TopToolbarProps) => {

  const { editor, items, variant, className, style = {} } = props

  return (
    <div
      className={cn("top-toolbar pb-2 mb-4", className)}
      style={{
        borderBottom: '1px solid var(--color-border)',
        ...style
      }}
    >
      <ToolbarBase editor={editor} variant={variant} items={items} />
      <LinkToolbar editor={editor} />
    </div>
  )
}