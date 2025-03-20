import { RenderElementProps } from "slate-react"
import * as CustomElements from "./Elements"

export default function RenderElement(props: RenderElementProps) {

  const type = props.element.type

  const RenderElement = Object.values(CustomElements).find(item => item.displayName === type)


  // if (type === 'link') {
  //   const url = props.element.url
  //   return (
  //     <a href={url} target="_blank" rel="noopener noreferrer" {...props.attributes} style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => {
  //       e.preventDefault()
  //       e.stopPropagation()
  //       window.open(url, '_blank')
  //     }}>{props.children}</a>
  //   )
  // }

  if (RenderElement) {
    return <RenderElement {...props} />
  }

  // const outerElement = config?.elements?.find(
  //   item => item.key === type
  //   //  && item.type === 'block'
  // )
  // if (outerElement) {
  //   const RenderElement = outerElement.element
  //   return <RenderElement  {...props} />
  // }

  return <div {...props.attributes} style={{ marginTop: 1, marginBottom: 1 }}>{props.children}</div>

}
