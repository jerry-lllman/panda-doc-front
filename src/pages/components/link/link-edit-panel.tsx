import { Button, Form, Input, Switch } from "antd"
import { useState } from "react"
import { cn } from "@/utils"
import type { LinkInfo } from "./types"

interface LinkEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  initialUrl?: string,
  initialTarget?: string,
  onSave: (value: LinkInfo) => void
}

export const LinkEditPanel = (props: LinkEditBlockProps) => {

  const { initialUrl, initialTarget, className, onSave } = props

  const [formValue, setFormValue] = useState<LinkInfo>({
    href: initialUrl || '',
    target: initialTarget || ''
  })

  const handleSubmit = () => {
    onSave(formValue)
  }

  return (
    <div className={cn('space-y-4 min-w-80', className)}>
      <Form onFinish={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder="Enter URL or search pages"
            value={formValue.href}
            onChange={e => setFormValue({
              ...formValue,
              href: e.target.value
            })}
          />
          <Switch
            checked={formValue.target === '_blank'}
            onChange={value => setFormValue({ ...formValue, target: value ? '_blank' : '_self' })}
          />
        </div>
        <div>
          <Button type="primary" htmlType="submit" size="small">Submit</Button>
        </div>
      </Form>
    </div>
  )
}
