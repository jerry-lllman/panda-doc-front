import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo } from "react"
import { TextToolbarContentTypes } from "../hooks/use-text-toolbar-content-types"
import { TooltipButton } from "../../tooltip-button"

interface ContentTypePickerProps {
  options: TextToolbarContentTypes[]
}

export const ContentTypePicker = (props: ContentTypePickerProps) => {
  const { options } = props

  const activeItem = useMemo(() => {
    const active = options.find(option => option.type === 'option' && option.isActive())
    return active || options[0]
  }, [options])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          className="px-2"
          tooltip={activeItem.label}
        >
          {activeItem.label}
        </TooltipButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {
            options.map(option => {
              const Icon = option.icon
              return (
                <DropdownMenuItem key={option.id} onClick={option.onClick}>
                  <Icon />
                  {option.label}
                </DropdownMenuItem>
              )
            })
          }

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
