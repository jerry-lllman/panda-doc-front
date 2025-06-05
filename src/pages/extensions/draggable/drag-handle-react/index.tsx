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
    tippyOptions: d = {}
  } = props
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const dragHandleRef = useRef(null)

  useEffect(() => {
    if (element) {
      if (editor.isDestroyed) {
        return () => {
          dragHandleRef.current = null;
        };
      }

      if (!dragHandleRef.current) {
        dragHandleRef.current = DragHandlePlugin({
          editor,
          element,
          pluginKey,
          tippyOptions: d,
          onNodeChange
        })

        editor.registerPlugin(dragHandleRef.current)
      }

      return () => {
        editor.unregisterPlugin(pluginKey);
        dragHandleRef.current = null;
      };
    }

    return () => {
      dragHandleRef.current = null;
    };
  }, [element, editor, onNodeChange, pluginKey])

  return <div className={className} ref={setElement}>{children}</div>
};

export { DragHandle, DragHandle as default };