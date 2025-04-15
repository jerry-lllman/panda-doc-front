import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toggleVariants } from "@/components/ui/toggle";
import { VariantProps } from "class-variance-authority";
import { TooltipButton } from "..";
import { Link } from "lucide-react";
import { LinkEditBlock } from ".";
import { LinkInfo } from "./types";
import { useState } from "react";

interface LinkButtonProps extends VariantProps<typeof toggleVariants> {
  getCurrentLink: () => LinkInfo | null
  onLink: (value: LinkInfo) => void
}

export const LinkButton = (props: LinkButtonProps) => {

  const { variant, getCurrentLink, onLink } = props

  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>()

  const onOpenChange = () => {
    setLinkInfo(getCurrentLink())
  }

  return (
    <Popover onOpenChange={onOpenChange}>
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
        <LinkEditBlock defaultValues={linkInfo} onSave={onLink} />
      </PopoverContent>
    </Popover>
  )
}