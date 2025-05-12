import { Button, Form, Input } from "antd"
import { cn } from "@/utils"
import type { LinkInfo } from "./types"

interface LinkEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  initialUrl?: string,
  initialTarget?: string,
  onSave: (value: LinkInfo) => void
}

export const LinkEditPanel = (props: LinkEditBlockProps) => {

  const { initialUrl, className, onSave } = props

  const handleSubmit = (value: LinkInfo) => {
    onSave(value)
  }

  return (
    <div className={cn('space-y-4 min-w-80', className)}>
      <Form
        layout="vertical"
        initialValues={{ href: initialUrl }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="href"
          label="Page or URL"
          required
          rules={[{ required: true, message: 'Please enter a page or URL', type: 'url' }]}
        >
          <Input
            placeholder="Enter URL or search pages"
          />
        </Form.Item>
        <div>
          <Button type="primary" htmlType="submit" >Submit</Button>
        </div>
      </Form>
    </div>
  )
}
