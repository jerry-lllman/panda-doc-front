import { css } from "@emotion/css"
import { cx } from "@emotion/css"

interface ItemContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
}

export default function ItemContainer(props: ItemContainerProps) {

  const { className, ...rest } = props

  return (
    <div style={{ display: 'contents' }}>
      <div className={cx(
        className,
        css`
          display: flex;
          align-items: center; 
          justify-content: center;
          cursor: pointer;
          // width: 28px;
          // height: 28px;
          padding: 6px;
          border-radius: 4px;
          transition: background 20ms ease-in;
          &:hover {
            background-color: rgba(55, 53, 47, 0.06);
          }
        `
      )} {...rest} />
    </div>
  )
}