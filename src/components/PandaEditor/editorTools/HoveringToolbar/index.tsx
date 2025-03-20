import { useSlate } from "slate-react";
import { css } from "@emotion/css";
import { FormatButton } from "./FormatButton";
import { BoldOutlined, StrikethroughOutlined, ItalicOutlined, UnderlineOutlined, LinkOutlined } from "@ant-design/icons";
import ItemContainer from "./ItemContainer";
import usePandaEditorStore from "../../store";

const TOOLBAR_GAP = 48

interface HoveringToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectionRect: DOMRect | null
}

export default function HoveringToolbar(props: HoveringToolbarProps) {

  const editor = useSlate()

  const showToolbar = props.selectionRect !== null

  const ghostElementWidth = (props.selectionRect?.left ?? 0) - 48

  const setLinkModal = usePandaEditorStore(state => state.setLinkModal)

  return (
    <div
      style={{
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 0,
        ...props.style
      }}
    >

      <div
        // ref={containerRef}
        className={css`
          // padding: 4px;
          position: absolute;
          display: flex; 
          top: -10000px;
          left: 0;
          width: 100%;
          // margin-top: -6px;
          opacity: ${showToolbar ? 1 : 0};
          // background-color: #fff;
          align-items: stretch;
          // box-shadow: rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px;
          border-radius: 4px;
          transition: opacity 0.75s;
          
        `}
        style={{
          top: props.selectionRect?.top ? `${props.selectionRect.top - TOOLBAR_GAP}px` : '-10000px',
        }}
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault()
        }}
      >
        <div
          className={css`
            flex-shrink: 1;
            width: ${ghostElementWidth}px;
            min-width: 24px;
          `}
        ></div>
        <div
          // ref={toolbarRef}
          className={css`
            display: flex;
            align-items: center;
          background-color: #fff;
            border-radius: 8px;
            padding: 4px 8px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px;

          `}
        >
          <FormatButton format="bold">
            <BoldOutlined />
          </FormatButton>

          <FormatButton format="italic">
            <ItalicOutlined />
          </FormatButton>

          <FormatButton format="underlined">
            <UnderlineOutlined />
          </FormatButton>

          <FormatButton format="strikethrough">
            <StrikethroughOutlined />
          </FormatButton>

          <ItemContainer >
            <div
              className={css`
            display: flex;
            align-items: center;
            `}
              onClick={() => {
                const selection = editor.selection
                setLinkModal({
                  visible: true,
                  selection,
                  link: '',
                })
              }}
            >
              <LinkOutlined />
            </div>
          </ItemContainer>
        </div>
        <div className={css`
          flex-grow: 1;
          flex-shrink: 1;
          min-width: 36px;
        `}></div>
      </div>
    </div>
  )
}

