import { Editor } from "@tiptap/react";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import { PluginKey, Plugin, Transaction, EditorState } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { Node } from "@tiptap/pm/model";
import tippy from "tippy.js";
import type { Instance as TippyInstance } from "tippy.js";
import {
  ySyncPluginKey,
  relativePositionToAbsolutePosition,
} from "y-prosemirror";
import { getSelectionRanges, NodeRangeSelection } from "../extension-node-range";
import type {
  RelativePosition,
  DragHandlePluginProps,
  DragHandlePluginState
} from "./types";
import {
  cloneElement,
  removeElement,
  findParentDomNode,
  getBlockStartPos,
  getTopLevelNode,
  positionToRelativePosition,
  findElementAndNode,
  getSelectionRangesFromEvent
} from "./helpers";



export const dragHandlePluginDefaultKey = new PluginKey<DragHandlePluginState>("dragHandle");

export const DragHandlePlugin = ({ pluginKey = dragHandlePluginDefaultKey, element, editor, tippyOptions, onNodeChange }: DragHandlePluginProps): Plugin<DragHandlePluginState> => {
  const containerDiv = document.createElement("div");
  let relativePosition: RelativePosition | null = null;
  let tippyInstance: TippyInstance | null = null;
  let isLocked = false;
  let currentNode: Node | null = null;
  let currentPos = -1;
  element.addEventListener("dragstart", (event) => {
    const handleDragStart = (dragEvent: DragEvent, editor: Editor) => {
      const { view } = editor;
      if (!dragEvent.dataTransfer) return;

      const { empty, $from, $to } = view.state.selection;
      const eventSelectionRanges = getSelectionRangesFromEvent(dragEvent, editor);
      const currentSelectionRanges = getSelectionRanges($from, $to, 0);
      const hasOverlappingSelection = currentSelectionRanges.some((currentRange) =>
        eventSelectionRanges.find((eventRange) =>
          eventRange.$from === currentRange.$from && eventRange.$to === currentRange.$to
        )
      );
      const finalSelectionRanges = empty || !hasOverlappingSelection ? eventSelectionRanges : currentSelectionRanges;

      if (!finalSelectionRanges.length) return;

      const { tr } = view.state;
      const dragImageContainer = document.createElement("div");
      const startPos = finalSelectionRanges[0].$from.pos;
      const endPos = finalSelectionRanges[finalSelectionRanges.length - 1].$to.pos;
      const nodeRangeSelection = NodeRangeSelection.create(view.state.doc, startPos, endPos);
      const sliceContent = nodeRangeSelection.content();

      finalSelectionRanges.forEach((range) => {
        const clonedNode = cloneElement(view.nodeDOM(range.$from.pos) as HTMLElement);
        dragImageContainer.append(clonedNode);
      });

      dragImageContainer.style.position = "absolute";
      dragImageContainer.style.top = "-10000px";
      document.body.append(dragImageContainer);
      dragEvent.dataTransfer.clearData();
      dragEvent.dataTransfer.setDragImage(dragImageContainer, 0, 0);
      // 设置编辑器的拖拽状态 - 这是 ProseMirror 内部 API
      (view as EditorView & { dragging?: { slice: unknown; move: boolean } }).dragging = { slice: sliceContent, move: true };
      tr.setSelection(nodeRangeSelection);
      view.dispatch(tr);
      document.addEventListener("drop", () => removeElement(dragImageContainer), { once: true });
    };

    handleDragStart(event as DragEvent, editor);

    setTimeout(() => {
      if (element) {
        element.style.pointerEvents = "none";
      }
    }, 0);
  });
  element.addEventListener("dragend", () => {
    if (element) {
      element.style.pointerEvents = "auto";
    }
  });

  return new Plugin<DragHandlePluginState>({
    key: typeof pluginKey === "string" ? new PluginKey(pluginKey) : pluginKey,
    state: {
      init: () => ({ locked: false }),
      apply(transaction: Transaction, state: DragHandlePluginState, oldState: EditorState, newState: EditorState): DragHandlePluginState {
        const lockMeta = transaction.getMeta("lockDragHandle");
        const hideMeta = transaction.getMeta("hideDragHandle");

        // 处理锁定元数据
        if (void 0 !== lockMeta) {
          isLocked = lockMeta;
        }

        // 处理隐藏元数据
        if (hideMeta && tippyInstance) {
          tippyInstance?.hide();
          isLocked = false;
          currentNode = null;
          currentPos = -1;

          if (onNodeChange) {
            onNodeChange({ editor, node: null, pos: -1 });
          }

          return state;
        }

        // 处理文档变更时的位置更新
        if (transaction.docChanged && currentPos !== -1 && element && tippyInstance) {
          if (isChangeOrigin(transaction)) {
            // 处理协同编辑的相对位置转换
            const calculateNewPosition = (state: EditorState, relativePos: RelativePosition | null): number => {
              const ySyncState = ySyncPluginKey.getState(state);
              if (ySyncState && relativePos) {
                return relativePositionToAbsolutePosition(
                  ySyncState.doc,
                  ySyncState.type,
                  relativePos,
                  ySyncState.binding.mapping
                ) || 0;
              }
              return -1;
            };

            const newPos = calculateNewPosition(newState, relativePosition);
            if (newPos !== currentPos) {
              currentPos = newPos;
            }
          } else {
            // 处理本地编辑的位置映射
            const mappedPos = transaction.mapping.map(currentPos);
            if (mappedPos !== currentPos) {
              currentPos = mappedPos;
              relativePosition = positionToRelativePosition(newState, currentPos);
            }
          }
        }
        return state;
      }
    },
    view: () => {
      const parentElement = editor.view.dom.parentElement;
      element.draggable = true;
      element.style.pointerEvents = "auto";
      parentElement?.appendChild(containerDiv);
      containerDiv.appendChild(element);
      containerDiv.style.pointerEvents = "none";
      containerDiv.style.position = "absolute";
      containerDiv.style.top = "0";
      containerDiv.style.left = "0";

      return {
        update(view: EditorView, prevState: EditorState) {
          if (!element) return;
          if (!editor.isEditable) {
            tippyInstance?.destroy();
            tippyInstance = null;
            return;
          }

          // 初始化 tippy 实例（如果还未初始化）
          if (!tippyInstance) {
            tippyInstance = tippy(view.dom, {
              getReferenceClientRect: null,
              interactive: true,
              trigger: "manual",
              placement: "left-start",
              hideOnClick: false,
              duration: 100,
              popperOptions: {
                modifiers: [
                  { name: "flip", enabled: false },
                  { name: "preventOverflow", options: { rootBoundary: "document", mainAxis: false } }
                ]
              },
              ...tippyOptions,
              appendTo: containerDiv,
              content: element
            });
          }

          // 设置拖拽状态
          element.draggable = !isLocked;

          // 如果文档未变更或当前位置无效，直接返回
          if (view.state.doc.eq(prevState.doc) || currentPos === -1) {
            return;
          }

          let domNode = view.nodeDOM(currentPos) as Element;
          domNode = findParentDomNode(view, domNode);

          if (domNode === view.dom) return;
          if (!(domNode as Element)?.nodeType || (domNode as Element).nodeType !== 1) return;

          const nodePos = view.posAtDOM(domNode, 0);
          const topLevelNode = getTopLevelNode(editor.state.doc, nodePos);
          const blockStartPos = getBlockStartPos(editor.state.doc, nodePos);

          currentNode = topLevelNode;
          currentPos = blockStartPos;
          relativePosition = positionToRelativePosition(view.state, currentPos);
          onNodeChange?.({ editor, node: currentNode, pos: currentPos });
          tippyInstance.setProps({ getReferenceClientRect: () => (domNode as HTMLElement).getBoundingClientRect() });
        },
        destroy() {
          tippyInstance?.destroy();
          if (element) {
            removeElement(containerDiv);
          }
        }
      };
    },
    props: {
      handleDOMEvents: {
        mouseleave: (_view: EditorView, event: MouseEvent) => {
          // 如果已锁定，不处理鼠标离开事件
          if (isLocked) {
            return false;
          }

          // 检查鼠标是否离开了容器区域
          const shouldHide = event.target && !containerDiv.contains(event.relatedTarget as Element);
          if (shouldHide) {
            tippyInstance?.hide();
            currentNode = null;
            currentPos = -1;
            onNodeChange?.({ editor, node: null, pos: -1 });
          }

          return false;
        },
        mousemove(view: EditorView, event: MouseEvent): boolean {
          if (!element || !tippyInstance || isLocked) return false;

          const searchResult = findElementAndNode({
            x: event.clientX,
            y: event.clientY,
            direction: "right",
            editor
          });

          if (!searchResult.resultElement) return false;

          let domNode = searchResult.resultElement;
          domNode = findParentDomNode(view, domNode) as HTMLElement;

          if (domNode === view.dom) return false;
          if ((domNode as HTMLElement)?.nodeType !== 1) return false;

          const nodePos = view.posAtDOM(domNode, 0);
          const topLevelNode = getTopLevelNode(editor.state.doc, nodePos);

          if (topLevelNode !== currentNode) {
            const blockStartPos = getBlockStartPos(editor.state.doc, nodePos);
            currentNode = topLevelNode;
            currentPos = blockStartPos;
            relativePosition = positionToRelativePosition(view.state, currentPos);
            onNodeChange?.({ editor, node: currentNode, pos: currentPos });
            tippyInstance.setProps({ getReferenceClientRect: () => domNode.getBoundingClientRect() });
            tippyInstance.show();
          }
          return false;
        }
      }
    }
  });
}; 