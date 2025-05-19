import { Fragment } from "react/jsx-runtime"
import type { MenuListProps } from "./types"
import { Button, Card } from "antd"
import { useCallback } from "react"
import { icons } from "lucide-react"

export const MenuList = (props: MenuListProps) => {


  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex]
      props.command(command)
    },
    [props],
  )

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
    <Card className="bg-background" styles={{
      body: {
        paddingLeft: 12
      }
    }}>
      {
        props.items.map((group, groupIndex) => (
          <Fragment key={`${group.title}-wrapper`}>
            <div className="text-xs text-gray-500 pl-3">
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
}