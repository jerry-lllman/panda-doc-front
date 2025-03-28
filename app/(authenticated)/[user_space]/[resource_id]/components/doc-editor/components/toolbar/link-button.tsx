import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toggleVariants } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";
import { VariantProps } from "class-variance-authority";
import ToolbarButton from "../toolbar-button";
import { Link } from "lucide-react";
import { LinkEditBlock } from "../link/link-edit-block";
import { useCallback } from "react";
import { LinkInfo } from "../link/type";



interface LinkButtonProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const LinkButton = (props: LinkButtonProps) => {

  const { editor, variant } = props

  const { from, to } = editor.state.selection
  const text = editor.state.doc.textBetween(from, to, ' ')
  const { href, target } = editor.getAttributes('link')

  const onSetLink = useCallback((value: LinkInfo) => {
    const { text, href, target } = value
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .insertContent({
        type: 'text',
        text: text || href,
        marks: [
          {
            type: 'link',
            attrs: {
              href,
              target
            }
          }
        ]
      })
      .setLink({ href })
      .run()

    editor.commands.enter()
  }, [editor])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('link')}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive('codeBlock')}
          // size={size}
          variant={variant}
        >
          <Link />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent>
        <LinkEditBlock defaultValues={{ text, href, target }} onSave={onSetLink} />
      </PopoverContent>
    </Popover>
  )
}