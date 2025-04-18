import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toggleVariants } from "@/components/ui/toggle";
import { VariantProps } from "class-variance-authority";
import { TooltipButton } from "..";
import { Link } from "lucide-react";
import { LinkEditPanel } from ".";
import { LinkInfo } from "./types";

interface LinkButtonProps extends VariantProps<typeof toggleVariants> {
  onLink: (value: LinkInfo) => void
}

export const LinkPopover = (props: LinkButtonProps) => {

  const { variant, onLink } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipButton
          tooltip="Link"
          aria-label="Insert link"
          variant={variant}
        >
          <Link />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent>
        <LinkEditPanel onSave={onLink} />
      </PopoverContent>
    </Popover>
  )
}