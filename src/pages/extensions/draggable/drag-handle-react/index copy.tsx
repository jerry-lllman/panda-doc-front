import { DragHandlePlugin, dragHandlePluginDefaultKey } from "../drag";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import type { Node } from '@tiptap/pm/model';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type DragHandleProps = Omit<Optional<DragHandlePluginProps, 'pluginKey'>, 'element'> & {
  className?: string;
  onNodeChange?: (data: {
    node: Node | null;
    editor: Editor;
    pos: number;
  }) => void;
  children: ReactNode;
};

const DragHandle = (props: DragHandleProps) => {
  const {
    className = "drag-handle",
    children,
    editor,
    pluginKey = dragHandlePluginDefaultKey,
    onNodeChange,
    tippyOptions = {}
  } = props

  const [dragElement, setDragElement] = useState<HTMLDivElement | null>(null)
  const dragRef = useRef(null);

  useEffect(() => {
    if (dragElement) {
      if (editor.isDestroyed) {
        return () => {
          dragRef.current = null;
        };
      }

      if (!dragRef.current) {
        dragRef.current = DragHandlePlugin({
          editor,
          element: dragElement,
          pluginKey,
          tippyOptions,
          onNodeChange
        })
        editor.registerPlugin(dragRef.current)
      }

      return () => {
        editor.unregisterPlugin(pluginKey);
        dragRef.current = null;
      };
    }

    return () => {
      dragRef.current = null;
    };
  }, [dragElement, editor, onNodeChange, pluginKey, tippyOptions])

  return (
    <div
      className={className}
      ref={setDragElement}
    >
      {children}
    </div>
  )
};

export { DragHandle, DragHandle as default };