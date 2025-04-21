
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import React from 'react'
import { SelectGroup } from '@radix-ui/react-select'

export const CodeBlockComponent = (props: NodeViewProps) => {
  const { node: { attrs: { language: defaultLanguage } }, updateAttributes, extension } = props
  return (

    <NodeViewWrapper className="code-block">
      <Select onValueChange={language => updateAttributes({ language })}>
        <SelectTrigger>
          {defaultLanguage}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {extension.options.lowlight.listLanguages().map((lang: string) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}