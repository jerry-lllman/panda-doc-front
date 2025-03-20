import { Button, Input } from "antd";
import { useLayoutEffect, useRef } from "react";
import { useEffect, useState } from "react";
import { useSlate } from "slate-react";
import usePandaEditorStore from "../../store";
import { useShallow } from "zustand/shallow";

interface LinkModalProps extends React.HTMLAttributes<HTMLDivElement> {
  selectionRect: DOMRect | null
}

const GAP = 24

export default function LinkModal(props: LinkModalProps) {

  const { selectionRect } = props

  const editor = useSlate()
  const { linkModal, setLinkModal, linkModalConfirm } = usePandaEditorStore(useShallow(state => ({ linkModal: state.linkModal, setLinkModal: state.setLinkModal, linkModalConfirm: state.linkModalConfirm })))

  const [link, setLink] = useState(linkModal.link)

  useEffect(() => {
    setLink(linkModal.link)
  }, [linkModal.link])

  const contentContainerRef = useRef<HTMLDivElement>(null)

  const [transformLeft, setTransformLeft] = useState(0)

  useLayoutEffect(() => {
    if (linkModal.visible) {
      const contentContainerLeft = contentContainerRef.current?.getBoundingClientRect().left ?? 0
      setTransformLeft(contentContainerLeft <= 0 ? Math.abs(contentContainerLeft) + GAP : 0)
    }
  }, [linkModal.visible])

  if (!linkModal.visible) {
    return null
  }

  return (
    <div
      style={{
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 0,
        ...props.style
      }}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <div style={{ display: 'contents' }}>
        <div>
          <div
            style={{
              position: 'fixed',
              inset: 0,
            }}
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
              // TODO: 还要恢复 selection
              setLinkModal({
                visible: false,
                selection: null,
                link: '',
              })
            }}
          />
          <div style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: selectionRect?.left ?? 0,
            top: selectionRect?.top ?? 0,
          }}>
            <div style={{ width: selectionRect?.width ?? 0, height: selectionRect?.height ?? 0 }}></div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  top: '100%',
                  pointerEvents: 'auto',
                }}
                ref={contentContainerRef}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    flexDirection: 'column-reverse',
                    transformOrigin: '50% top',
                    left: transformLeft,
                    top: 8,
                    opacity: 1,
                    transform: 'scaleX(1) scaleY(1)',
                    transitionDuration: '200ms',
                    transitionTimingFunction: 'ease',
                    transitionProperty: 'opacity, transform',
                  }}
                >

                  <div style={{
                    borderRadius: 10,
                    backdropFilter: 'none',
                    position: 'relative',
                    maxWidth: 'calc(-24px + 100vw)',
                    // boxShadow: 'rgba(0, 0, 0, 0.2) 0px 14px 28px -6px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px, rgba(255, 255, 255, 0.094) 0px 0px 0px 1px',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px',
                    overflow: 'hidden',
                    width: '400px',
                  }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 180,
                        maxWidth: 'calc(-24px + 100vw)',
                        height: '100%',
                        maxHeight: '70vh',
                      }}
                    >
                      <div
                        style={{
                          zIndex: 1,
                          flexGrow: 1,
                          minHeight: 0,
                          transform: 'translateZ(0px)',
                          overflow: 'hidden auto',
                          marginRight: 0,
                          marginBottom: 0,
                          background: 'white',
                          padding: 16,
                          borderRadius: 8,
                        }}
                      >

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <div
                            style={{
                              flex: 1
                            }}
                          >
                            <Input value={link} onChange={e => setLink(e.target.value)} />
                          </div>
                          <Button onClick={() => linkModalConfirm(editor, link)}>确认</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )

}