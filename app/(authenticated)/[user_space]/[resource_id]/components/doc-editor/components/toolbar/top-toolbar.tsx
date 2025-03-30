import { Editor } from "@tiptap/react"
import { TextStyleAction } from "./toolbar-format"
import { VariantProps } from "class-variance-authority"
import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/lib/utils";
import { ToolbarBase } from "./toolbar";
import { LinkToolbar } from "./link";
import React from "react";

interface TopToolbarProps extends Partial<HTMLDivElement>, VariantProps<typeof toggleVariants> {
  editor: Editor;
  items: TextStyleAction[];
}

const TopToolbarComponent = (props: TopToolbarProps) => {
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

export const TopToolbar = React.memo(TopToolbarComponent, (oldProps, newProps) => {
  // TODO: optimize this
  return oldProps.editor === newProps.editor && JSON.stringify(oldProps.items) === JSON.stringify(newProps.items) && oldProps.variant === newProps.variant && oldProps.className === newProps.className && oldProps.style === newProps.style
})