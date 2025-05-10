import { Dropdown } from "antd"
import type { MenuProps } from "antd"
import { useMemo } from "react"
import type { TextToolbarContentTypes } from "../../../hooks/use-editor-content-types"
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

  const menuItems: MenuProps['items'] = options.map(option => {
    const Icon = option.icon as React.ComponentType<{ size: number }>
    return {
      key: option.id,
      onClick: option.onClick,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={14} />
          {option.label}
        </div>
      )
    }
  })

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomLeft"
    >
      <div>
        <TooltipButton
          className="px-2"
          tooltip={activeItem.label}
        >
          {activeItem.label}
        </TooltipButton>
      </div>
    </Dropdown>
  )
}
