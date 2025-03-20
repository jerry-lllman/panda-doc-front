import { GlobalOutlined, CopyOutlined } from "@ant-design/icons"
import { message, Popover } from "antd";
import { RenderElementProps } from "slate-react";


export function Link(props: RenderElementProps) {

  const type = props.element.type

  const [messageApi, contextHolder] = message.useMessage()

  if (type !== 'link') return null

  const url = props.element.url

  const copyHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    navigator.clipboard.writeText(url)
    messageApi.open({
      type: 'success',
      content: '已将链接拷贝到剪切板'
    })
  }

  const popoverContent = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,

      }}>
        <GlobalOutlined />
        <span>{url}</span>
      </div>
      <CopyOutlined onClick={copyHandler} />
      <span>编辑</span>
    </div>
  )

  return (
    <>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        {...props.attributes}
        style={{ color: 'blue', cursor: 'pointer' }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          window.open(url, '_blank')
        }}
      >
        <Popover
          arrow={false}
          placement="bottomLeft"
          content={popoverContent}
        >
          <span >
            {props.children}
          </span>
        </Popover>
      </a>
      {contextHolder}
    </>
  )

}

Link.displayName = 'link'