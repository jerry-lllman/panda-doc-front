import * as React from 'react'
import { Tooltip, Button } from 'antd'
import type { TooltipProps as AntdTooltipProps, ButtonProps } from 'antd'
import { cn } from '../../../utils/cn'

interface ToolbarButtonProps extends Omit<ButtonProps, 'tooltip'> {
  isActive?: boolean
  tooltip?: React.ReactNode
  tooltipProps?: Omit<AntdTooltipProps, 'title'>
}

export const TooltipButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (props, ref) => {
    const { isActive, children, tooltip, className, tooltipProps, ...restProps } = props
    const buttonStyle = isActive ? { background: 'var(--ant-color-primary-bg)' } : {}

    const buttonElement = (
      <Button
        ref={ref}
        type="text"
        size="small"
        className={cn('size-8 w-auto p-0', className)}
        style={buttonStyle}
        {...restProps}
      >
        {children}
      </Button>
    )

    if (!tooltip) {
      return buttonElement
    }

    return (
      <Tooltip title={tooltip} {...tooltipProps}>
        {buttonElement}
      </Tooltip>
    )
  }
)

TooltipButton.displayName = 'TooltipButton'
