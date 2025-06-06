import { Extension, Editor } from "@tiptap/react";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import { PluginKey, Plugin, Transaction, EditorState } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { Node } from "@tiptap/pm/model";
import tippy from "tippy.js";
import type { Props as TippyProps, Instance as TippyInstance } from "tippy.js";
import {
  ySyncPluginKey,
  absolutePositionToRelativePosition,
  relativePositionToAbsolutePosition,
} from "y-prosemirror";
import { getSelectionRanges, NodeRangeSelection } from "./extension-node-range";

type RelativePosition = any; // y-prosemirror 类型定义

interface FindElementAndNodeResult {
  resultElement: HTMLElement | null;
  resultNode: Node | null;
  pos: number | null;
}

interface FindElementAndNodeParams {
  x: number;
  y: number;
  direction: 'left' | 'right';
  editor: Editor;
}

interface DragHandleOptions {
  render(): HTMLElement;
  tippyOptions?: Partial<TippyProps>;
  locked?: boolean;
  onNodeChange?: (options: { editor: Editor; node: Node | null; pos: number }) => void;
}

export interface DragHandlePluginProps {
  pluginKey?: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
  onNodeChange?: (data: { editor: Editor; node: Node | null; pos: number }) => void;
  tippyOptions?: Partial<TippyProps>;
}

export interface DragHandlePluginState {
  locked: boolean;
}

function cloneElement(element: HTMLElement): HTMLElement {
  const clonedElement = element.cloneNode(true) as HTMLElement;
  const originalElements = [element, ...Array.from(element.getElementsByTagName("*"))];
  const clonedElements = [clonedElement, ...Array.from(clonedElement.getElementsByTagName("*"))];

  // 为每个克隆元素复制原始元素的计算样式
  originalElements.forEach((originalEl, index) => {
    const clonedEl = clonedElements[index] as HTMLElement;
    clonedEl.style.cssText = getAllComputedStyles(originalEl);
  });

  return clonedElement;
}

function getAllComputedStyles(element: Element): string {
  let cssText = "";
  const computedStyle = getComputedStyle(element);
  for (let i = 0; i < computedStyle.length; i += 1) {
    const property = computedStyle[i];
    cssText += `${property}:${computedStyle.getPropertyValue(property)};`;
  }
  return cssText;
}

const findElementAndNode = ({ x, y, direction, editor }: FindElementAndNodeParams): FindElementAndNodeResult => {
  const MAX_SEARCH_DISTANCE = 50; // 限制搜索距离，避免无限循环
  const STEP = direction === "left" ? -1 : 1;

  let currentX = x;
  const searchBounds = {
    min: Math.max(0, x - MAX_SEARCH_DISTANCE),
    max: Math.min(window.innerWidth, x + MAX_SEARCH_DISTANCE)
  };

  // 在指定范围内搜索
  while (currentX >= searchBounds.min && currentX <= searchBounds.max) {
    const searchResult = findNodeAtPosition(currentX, y, editor);

    if (searchResult.resultElement && searchResult.pos >= 0) {
      const node = findValidNode(editor, searchResult.pos);
      if (node) {
        return {
          resultElement: searchResult.resultElement,
          resultNode: node,
          pos: searchResult.pos
        };
      }
    }

    currentX += STEP;
  }

  // 如果没有找到，返回空结果
  return {
    resultElement: null,
    resultNode: null,
    pos: null
  };
};

// 辅助函数：在指定位置查找元素
function findNodeAtPosition(x: number, y: number, editor: Editor): { resultElement: HTMLElement | null; pos: number } {
  const elementsAtPoint = document.elementsFromPoint(x, y);
  const proseMirrorIndex = elementsAtPoint.findIndex(element =>
    element.classList.contains("ProseMirror")
  );

  if (proseMirrorIndex === -1) {
    return { resultElement: null, pos: -1 };
  }

  const elementsBeforeProseMirror = elementsAtPoint.slice(0, proseMirrorIndex);

  if (elementsBeforeProseMirror.length === 0) {
    return { resultElement: null, pos: -1 };
  }

  const targetElement = elementsBeforeProseMirror[0] as HTMLElement;
  const pos = editor.view.posAtDOM(targetElement, 0);

  return {
    resultElement: targetElement,
    pos: pos
  };
}

// 辅助函数：找到有效的节点
function findValidNode(editor: Editor, pos: number): Node | null {
  if (pos < 0) return null;

  const doc = editor.state.doc;

  // 尝试获取位置前一个节点
  let node = doc.nodeAt(Math.max(pos - 1, 0));

  // 如果是文本节点，跳过
  if (node?.isText) {
    node = doc.nodeAt(Math.max(pos - 1, 0));
  }

  // 如果仍然没有找到，尝试当前位置
  if (!node) {
    node = doc.nodeAt(Math.max(pos, 0));
  }

  return node;
}

function getComputedStyleProperty(element: Element, property: keyof CSSStyleDeclaration): any {
  return window.getComputedStyle(element)[property];
}

function clamp(value: number = 0, min: number = 0, max: number = 0): number {
  return Math.min(Math.max(value, min), max);
}

function removeElement(element: HTMLElement | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function getConstrainedCoords(view: EditorView, x: number, y: number): { left: number; top: number } {
  const rect = view.dom.getBoundingClientRect();

  // 获取边距和边框
  const paddingLeft = parseInt(getComputedStyleProperty(view.dom, "paddingLeft"), 10) || 0;
  const paddingRight = parseInt(getComputedStyleProperty(view.dom, "paddingRight"), 10) || 0;
  const borderLeftWidth = parseInt(getComputedStyleProperty(view.dom, "borderLeftWidth"), 10) || 0;
  const borderRightWidth = parseInt(getComputedStyleProperty(view.dom, "borderRightWidth"), 10) || 0;

  return {
    left: clamp(
      x,
      rect.left + paddingLeft + borderLeftWidth,
      rect.right - paddingRight - borderRightWidth
    ),
    top: y
  };
}

function getSelectionRangesFromEvent(event: DragEvent, editor: Editor): any[] {
  const { doc } = editor.view.state;
  const searchResult = findElementAndNode({
    editor,
    x: event.clientX,
    y: event.clientY,
    direction: "right"
  });

  if (!searchResult.resultNode || searchResult.pos === null) {
    return [];
  }

  // 获取约束后的坐标
  const constrainedCoords = getConstrainedCoords(editor.view, event.clientX, event.clientY);
  const coordsPos = editor.view.posAtCoords(constrainedCoords);

  if (!coordsPos) {
    return [];
  }

  const { pos } = coordsPos;
  const resolvedPos = doc.resolve(pos);

  if (!resolvedPos.parent) {
    return [];
  }

  const fromResolvedPos = doc.resolve(searchResult.pos);
  const toResolvedPos = doc.resolve(searchResult.pos + 1);

  return getSelectionRanges(fromResolvedPos, toResolvedPos, 0);
}

const getBlockStartPos = (doc: Node, pos: number): number => {
  const resolvedPos = doc.resolve(pos);
  const { depth } = resolvedPos;
  if (0 === depth) return pos;
  return resolvedPos.pos - resolvedPos.parentOffset - 1;
};

const getTopLevelNode = (doc: Node, pos: number): Node | null => {
  const nodeAtPos = doc.nodeAt(pos);
  const resolvedPos = doc.resolve(pos);
  let { depth } = resolvedPos;
  let topLevelNode = nodeAtPos;

  for (; depth > 0;) {
    const nodeAtDepth = resolvedPos.node(depth);
    depth -= 1;
    if (0 === depth) {
      topLevelNode = nodeAtDepth;
    }
  }
  return topLevelNode;
};

const positionToRelativePosition = (state: EditorState, pos: number): RelativePosition | null => {
  const ySyncState = ySyncPluginKey.getState(state);
  return ySyncState ? absolutePositionToRelativePosition(pos, ySyncState.type, ySyncState.binding.mapping) : null;
};

const findParentDomNode = (view: EditorView, element: Element): Element => {
  let currentElement: Element | null = element;
  for (; currentElement && currentElement.parentNode && currentElement.parentNode !== view.dom;)
    currentElement = currentElement.parentNode as Element;
  return currentElement!;
};

const dragHandlePluginDefaultKey = new PluginKey<DragHandlePluginState>("dragHandle");

const DragHandlePlugin = ({ pluginKey = dragHandlePluginDefaultKey, element, editor, tippyOptions, onNodeChange }: DragHandlePluginProps): Plugin<DragHandlePluginState> => {
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
      (view as any).dragging = { slice: sliceContent, move: true };
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
    view: (view: EditorView) => {
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

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    dragHandle: {
      lockDragHandle: () => ReturnType;
      unlockDragHandle: () => ReturnType;
      toggleDragHandle: () => ReturnType;
    };
  }
}

const DragHandle = Extension.create<DragHandleOptions>({
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

export { DragHandle, DragHandlePlugin, DragHandle as default, dragHandlePluginDefaultKey }; 