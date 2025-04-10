import * as React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { TooltipProps, TooltipContentProps } from '@radix-ui/react-tooltip'

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean
  tooltip?: React.ReactNode
  tooltipProps?: TooltipProps
  tooltipContentProps?: TooltipContentProps
}

export const TooltipButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (props, ref) => {
    const { isActive, children, tooltip, className, tooltipProps, tooltipContentProps, ...restProps } = props
    const toggleButton = (
      <Toggle size="sm" ref={ref} className={cn('size-8 p-0', { 'bg-accent': isActive }, className)} {...restProps}>
        {children}
      </Toggle>
    )

    if (!tooltip) {
      return toggleButton
    }

    return (
      <Tooltip disableHoverableContent {...tooltipProps}>
        <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
        <TooltipContent {...tooltipContentProps}>
          <div className="flex flex-col items-center">{tooltip}</div>
        </TooltipContent>
      </Tooltip>
    )
  }
)

TooltipButton.displayName = 'TooltipButton'
