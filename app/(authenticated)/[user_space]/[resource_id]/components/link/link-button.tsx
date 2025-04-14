import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toggleVariants } from "@/components/ui/toggle";
import { VariantProps } from "class-variance-authority";
import { TooltipButton } from "..";
import { Link } from "lucide-react";
import { LinkEditBlock } from ".";
import { LinkInfo } from "./types";

interface LinkButtonProps extends VariantProps<typeof toggleVariants> {
  linkInfo?: LinkInfo
  onLink: (value: LinkInfo) => void
}

export const LinkButton = (props: LinkButtonProps) => {

  const { variant, linkInfo, onLink } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipButton
          tooltip="Link"
          aria-label="Insert link"
          isActive={!!linkInfo?.href}
          variant={variant}
        >
          <Link />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent>
        <LinkEditBlock defaultValues={linkInfo} onSave={onLink} />
      </PopoverContent>
    </Popover>
  )
}