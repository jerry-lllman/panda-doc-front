import {
  CursorOverlayData,
  useRemoteCursorOverlayPositions,
} from '@slate-yjs/react'
import { useRef } from 'react'
import './styles.css'

export function Cursors({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cursors] = useRemoteCursorOverlayPositions({ containerRef: containerRef as React.RefObject<HTMLDivElement> })

  return (
    <div className="cursors" ref={containerRef}>
      {children}
      {cursors.map(cursor => (
        <Selection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  )
}

function Selection({ data, selectionRects, caretPosition }: any) {
  if (!data) {
    return null
  }

  const selectionStyle = {
    backgroundColor: data.color,
  }

  return (
    <>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className="selection"
          key={i}
        />
      ))}
      {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
    </>
  )
}

function Caret({ caretPosition, data }) {
  const caretStyle = {
    ...caretPosition,
    background: data?.color,
  }

  const labelStyle = {
    transform: 'translateY(-100%)',
    background: data?.color,
  }

  return (
    <div style={caretStyle} className="caretMarker">
      <div className="caret" style={labelStyle}>
        {data?.name}
      </div>
    </div>
  )
}