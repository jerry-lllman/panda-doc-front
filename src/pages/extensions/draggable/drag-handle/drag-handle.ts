import { Extension, Editor } from "@tiptap/react";
import type { DragHandleOptions } from "./types";
import { DragHandlePlugin } from "./drag-handle-plugin";

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    dragHandle: {
      /**
       * 锁定拖拽句柄的位置和可见性
       */
      lockDragHandle: () => ReturnType;
      /**
       * 解锁拖拽句柄
       */
      unlockDragHandle: () => ReturnType;
      /**
       * 切换拖拽句柄锁定状态
       */
      toggleDragHandle: () => ReturnType;
    };
  }
}

export const DragHandle = Extension.create<DragHandleOptions>({
  name: "dragHandle",
  addOptions(): DragHandleOptions {
    return {
      render() {
        const dragHandleElement = document.createElement("div");
        dragHandleElement.classList.add("drag-handle");
        return dragHandleElement;
      },
      tippyOptions: {},
      locked: false,
      onNodeChange: () => null
    };
  },
  addCommands() {
    return {
      lockDragHandle: () => ({ editor }: { editor: Editor }) => {
        this.options.locked = true;
        return editor.commands.setMeta("lockDragHandle", this.options.locked);
      },
      unlockDragHandle: () => ({ editor }: { editor: Editor }) => {
        this.options.locked = false;
        return editor.commands.setMeta("lockDragHandle", this.options.locked);
      },
      toggleDragHandle: () => ({ editor }: { editor: Editor }) => {
        this.options.locked = !this.options.locked;
        return editor.commands.setMeta("lockDragHandle", this.options.locked);
      }
    };
  },
  addProseMirrorPlugins() {
    const dragHandleElement = this.options.render();
    return [DragHandlePlugin({
      tippyOptions: this.options.tippyOptions,
      element: dragHandleElement,
      editor: this.editor,
      onNodeChange: this.options.onNodeChange
    })];
  }
});

export default DragHandle; 