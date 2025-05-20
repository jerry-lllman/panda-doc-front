import { Fragment } from "react/jsx-runtime"
import type { MenuListProps } from "./types"
import { Button, Card, theme, } from "antd"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { icons } from "lucide-react"

export const MenuList = forwardRef((props: MenuListProps, ref) => {

  const { token } = theme.useToken();

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  useEffect(() => {
    setSelectedGroupIndex(0)
    setSelectedCommandIndex(0)
  }, [props.items])

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex]
      props.command(command)
    },
    [props],
  )

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowDown') {
        if (!props.items.length) {
          return false
        }

        const commands = props.items[selectedGroupIndex].commands

        let newCommandIndex = selectedCommandIndex + 1
        let newGroupIndex = selectedGroupIndex

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0
          newGroupIndex = selectedGroupIndex + 1
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === 'ArrowUp') {
        if (!props.items.length) {
          return false
        }

        let newCommandIndex = selectedCommandIndex - 1
        let newGroupIndex = selectedGroupIndex

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1
          newCommandIndex = props.items[newGroupIndex].commands.length - 1
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === 'Enter') {
        if (!props.items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
          return false
        }

        selectItem(selectedGroupIndex, selectedCommandIndex)

        return true
      }

      return false
    }
  }))


  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex)
      }
    },
    [selectItem],
  )

  if (!props.items.length) {
    return null
  }

  return (
    <Card
      className="bg-background"
      size="small"
    >
      {
        props.items.map((group, groupIndex) => (
          <Fragment key={`${group.title}-wrapper`}>
            <div className="text-xs text-gray-500 pl-3 mb-1">
              {group.title}
            </div>
            {
              group.commands.map((command, commandIndex) => {
                const Icon = icons[command.iconName]
                return (
                  <Button
                    block
                    type="text"
                    className="!text-start !justify-start"
                    key={command.label}
                    onClick={createCommandClickHandler(groupIndex, commandIndex)}
                    icon={<Icon size={14} />}
                    style={{
                      background: selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex ? token.controlItemBgHover : undefined
                    }}
                  >
                    {command.label}
                  </Button>
                )
              })
            }
          </Fragment>
        ))
      }
    </Card>
  )
})