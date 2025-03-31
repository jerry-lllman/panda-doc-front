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
  const oldPropsKeys = Object.keys(oldProps)
  const newPropsKeys = Object.keys(newProps)

  if (JSON.stringify(oldPropsKeys) !== JSON.stringify(newPropsKeys)) {
    return false
  }

  for (const key of oldPropsKeys) {
    const keyName = key as keyof TopToolbarProps

    if (Object.is(oldProps[keyName], newProps[keyName])) {
      continue
    }

    try {
      if (JSON.stringify(oldProps[keyName]) !== JSON.stringify(newProps[keyName])) {
        return false
      }
    } catch (_error) {
      return false
    }
  }

  return true
})