import { Popover, } from "antd";
import { TooltipButton } from "..";
import { LinkOutlined } from "@ant-design/icons";
import { LinkEditPanel } from ".";
import type { LinkInfo } from "./types";

interface LinkButtonProps {
  onLink: (value: LinkInfo) => void
}

export const LinkPopover = (props: LinkButtonProps) => {

  const { onLink } = props

  return (
    <Popover
      content={<LinkEditPanel onSave={onLink} />}
    >
      <TooltipButton
        tooltip="Link"
        aria-label="Insert link"
      >
        <LinkOutlined />
      </TooltipButton>
    </Popover>
  )
}