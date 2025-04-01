import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toggleVariants } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";
import { VariantProps } from "class-variance-authority";
import { TooltipButton } from "../";
import { Link } from "lucide-react";
import { LinkEditBlock } from ".";
import { useCallback, useState } from "react";
import { LinkInfo } from "./types";

interface LinkButtonProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const LinkButton = (props: LinkButtonProps) => {

  const { editor, variant } = props

  const [open, setOpen] = useState(false)
  const [linkInfo, setLinkInfo] = useState<LinkInfo>({
    text: '',
    href: '',
    target: '_self'
  })

  const openLinkModal = useCallback((visible: boolean) => {

    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, ' ')
    const { href, target } = editor.getAttributes('link')

    setLinkInfo({
      text,
      href: href || '',
      target: target || ''
    })
    setOpen(visible)
  }, [editor])


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
    <Popover open={open} onOpenChange={openLinkModal}>
      <PopoverTrigger asChild>
        <TooltipButton
          isActive={editor.isActive('link')}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive('codeBlock')}
          // size={size}
          variant={variant}
        >
          <Link />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent>
        <LinkEditBlock defaultValues={linkInfo} onSave={onSetLink} />
      </PopoverContent>
    </Popover>
  )
}