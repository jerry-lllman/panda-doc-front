import * as React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { TooltipContentProps } from '@radix-ui/react-tooltip'

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean
  tooltip?: string
  tooltipOptions?: TooltipContentProps
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (props, ref) => {
    const { isActive, children, tooltip, className, tooltipOptions, ...restProps } = props
    const toggleButton = (
      <Toggle size="sm" ref={ref} className={cn('size-8 p-0', { 'bg-accent': isActive }, className)} {...restProps}>
        {children}
      </Toggle>
    )

    if (!tooltip) {
      return toggleButton
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
        <TooltipContent  {...tooltipOptions}>
          <div className="flex flex-col items-center text-center">{tooltip}</div>
        </TooltipContent>
      </Tooltip>
    )
  }
)

ToolbarButton.displayName = 'ToolbarButton'
