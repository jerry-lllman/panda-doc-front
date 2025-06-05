import { Extension } from "@tiptap/react";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import tippy from "tippy.js";
import {
  ySyncPluginKey,
  absolutePositionToRelativePosition,
  relativePositionToAbsolutePosition
} from "y-prosemirror";
import { getSelectionRanges, NodeRangeSelection } from "./extension-node-range";

function cloneElementWithStyles(element) {
  const clonedElement = element.cloneNode(true);
  const originalElements = [element, ...Array.from(element.getElementsByTagName("*"))];
  const clonedElements = [clonedElement, ...Array.from(clonedElement.getElementsByTagName("*"))];

  // 为每个克隆元素复制原始元素的计算样式
  originalElements.forEach((originalEl, index) => {
    const clonedEl = clonedElements[index];
    clonedEl.style.cssText = getAllComputedStyles(originalEl);
  });

  return clonedElement;
}

function getAllComputedStyles(element) {
  let cssText = "";
  const computedStyle = getComputedStyle(element);
  for (let i = 0; i < computedStyle.length; i += 1) {
    const property = computedStyle[i];
    cssText += `${property}:${computedStyle.getPropertyValue(property)};`;
  }
  return cssText;
}

const findElementAndNode = ({ x, y, direction, editor }) => {
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
function findNodeAtPosition(x, y, editor) {
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

  const targetElement = elementsBeforeProseMirror[0];
  const pos = editor.view.posAtDOM(targetElement, 0);

  return {
    resultElement: targetElement,
    pos: pos
  };
}

// 辅助函数：找到有效的节点
function findValidNode(editor, pos) {
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

function getComputedStyleProperty(element, property) {
  return window.getComputedStyle(element)[property];
}

function clamp(value = 0, min = 0, max = 0) {
  return Math.min(Math.max(value, min), max);
}

function removeElement(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function getConstrainedCoords(view, x, y) {
  const style = view.dom.style;
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

function getSelectionRangesFromEvent(event, editor) {
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

const getBlockStartPos = (doc, pos) => {
  const resolvedPos = doc.resolve(pos);
  const { depth } = resolvedPos;
  if (0 === depth) return pos;
  return resolvedPos.pos - resolvedPos.parentOffset - 1;
};

const getTopLevelNode = (doc, pos) => {
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

const positionToRelativePosition = (state, pos) => {
  const ySyncState = ySyncPluginKey.getState(state);
  return ySyncState ? absolutePositionToRelativePosition(pos, ySyncState.type, ySyncState.binding.mapping) : null;
};

const findParentDomNode = (view, element) => {
  let currentElement = element;
  for (; currentElement && currentElement.parentNode && currentElement.parentNode !== view.dom;)
    currentElement = currentElement.parentNode;
  return currentElement;
};

const dragHandlePluginDefaultKey = new PluginKey("dragHandle");

const DragHandlePlugin = ({ pluginKey = dragHandlePluginDefaultKey, element, editor, tippyOptions, onNodeChange }) => {
  const containerDiv = document.createElement("div");
  let relativePosition, tippyInstance = null, isLocked = false, currentNode = null, currentPos = -1;

  return element.addEventListener("dragstart", (event => {
    !function (dragEvent, editor) {
      const { view } = editor;
      if (!dragEvent.dataTransfer) return;

      const { empty, $from, $to } = view.state.selection;
      const eventSelectionRanges = getSelectionRangesFromEvent(dragEvent, editor);
      const currentSelectionRanges = getSelectionRanges($from, $to, 0);
      const hasOverlappingSelection = currentSelectionRanges.some((currentRange =>
        eventSelectionRanges.find((eventRange =>
          eventRange.$from === currentRange.$from && eventRange.$to === currentRange.$to
        ))
      ));
      const finalSelectionRanges = empty || !hasOverlappingSelection ? eventSelectionRanges : currentSelectionRanges;

      if (!finalSelectionRanges.length) return;

      const { tr } = view.state;
      const dragImageContainer = document.createElement("div");
      const startPos = finalSelectionRanges[0].$from.pos;
      const endPos = finalSelectionRanges[finalSelectionRanges.length - 1].$to.pos;
      const nodeRangeSelection = NodeRangeSelection.create(view.state.doc, startPos, endPos);
      const sliceContent = nodeRangeSelection.content();

      finalSelectionRanges.forEach((range => {
        const clonedNode = cloneElementWithStyles(view.nodeDOM(range.$from.pos));
        dragImageContainer.append(clonedNode);
      }));

      dragImageContainer.style.position = "absolute";
      dragImageContainer.style.top = "-10000px";
      document.body.append(dragImageContainer);
      dragEvent.dataTransfer.clearData();
      dragEvent.dataTransfer.setDragImage(dragImageContainer, 0, 0);
      view.dragging = { slice: sliceContent, move: true };
      tr.setSelection(nodeRangeSelection);
      view.dispatch(tr);
      document.addEventListener("drop", (() => removeElement(dragImageContainer)), { once: true });
    }(event, editor),
      setTimeout((() => {
        element && (element.style.pointerEvents = "none");
      }), 0);
  })),
    element.addEventListener("dragend", (() => {
      element && (element.style.pointerEvents = "auto");
    })),
    new Plugin({
      key: "string" == typeof pluginKey ? new PluginKey(pluginKey) : pluginKey,
      state: {
        init: () => ({ locked: false }),
        apply(transaction, state, oldState, newState) {
          const lockMeta = transaction.getMeta("lockDragHandle");
          const hideMeta = transaction.getMeta("hideDragHandle");

          if (void 0 !== lockMeta && (isLocked = lockMeta), hideMeta && tippyInstance)
            return tippyInstance.hide(),
              isLocked = false,
              currentNode = null,
              currentPos = -1,
              null == onNodeChange || onNodeChange({ editor, node: null, pos: -1 }),
              state;

          if (transaction.docChanged && -1 !== currentPos && element && tippyInstance)
            if (isChangeOrigin(transaction)) {
              const newPos = ((state, relativePos) => {
                const ySyncState = ySyncPluginKey.getState(state);
                return ySyncState ? relativePositionToAbsolutePosition(ySyncState.doc, ySyncState.type, relativePos, ySyncState.binding.mapping) || 0 : -1;
              })(newState, relativePosition);
              newPos !== currentPos && (currentPos = newPos);
            } else {
              const mappedPos = transaction.mapping.map(currentPos);
              mappedPos !== currentPos && (currentPos = mappedPos, relativePosition = positionToRelativePosition(newState, currentPos));
            }
          return state;
        }
      },
      view: view => {
        var parentElement;
        return element.draggable = true,
          element.style.pointerEvents = "auto",
          null === (parentElement = editor.view.dom.parentElement) || void 0 === parentElement || parentElement.appendChild(containerDiv),
          containerDiv.appendChild(element),
          containerDiv.style.pointerEvents = "none",
          containerDiv.style.position = "absolute",
          containerDiv.style.top = "0",
          containerDiv.style.left = "0",
        {
          update(view, prevState) {
            if (!element) return;
            if (!editor.isEditable)
              return null == tippyInstance || tippyInstance.destroy(), void (tippyInstance = null);

            if (tippyInstance || (tippyInstance = tippy(view.dom, {
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
            })), element.draggable = !isLocked, view.state.doc.eq(prevState.doc) || -1 === currentPos)
              return;

            let domNode = view.nodeDOM(currentPos);
            if (domNode = findParentDomNode(view, domNode), domNode === view.dom) return;
            if (1 !== (null == domNode ? void 0 : domNode.nodeType)) return;

            const nodePos = view.posAtDOM(domNode, 0);
            const topLevelNode = getTopLevelNode(editor.state.doc, nodePos);
            const blockStartPos = getBlockStartPos(editor.state.doc, nodePos);

            currentNode = topLevelNode;
            currentPos = blockStartPos;
            relativePosition = positionToRelativePosition(view.state, currentPos);
            null == onNodeChange || onNodeChange({ editor, node: currentNode, pos: currentPos });
            tippyInstance.setProps({ getReferenceClientRect: () => domNode.getBoundingClientRect() });
          },
          destroy() {
            null == tippyInstance || tippyInstance.destroy();
            element && removeElement(containerDiv);
          }
        };
      },
      props: {
        handleDOMEvents: {
          mouseleave: (view, event) => (
            isLocked || event.target && !containerDiv.contains(event.relatedTarget) && (
              null == tippyInstance || tippyInstance.hide(),
              currentNode = null,
              currentPos = -1,
              null == onNodeChange || onNodeChange({ editor, node: null, pos: -1 })
            ),
            false
          ),
          mousemove(view, event) {
            if (!element || !tippyInstance || isLocked) return false;

            const searchResult = findElementAndNode({
              x: event.clientX,
              y: event.clientY,
              direction: "right",
              editor
            });

            if (!searchResult.resultElement) return false;

            let domNode = searchResult.resultElement;
            if (domNode = findParentDomNode(view, domNode), domNode === view.dom) return false;
            if (1 !== (null == domNode ? void 0 : domNode.nodeType)) return false;

            const nodePos = view.posAtDOM(domNode, 0);
            const topLevelNode = getTopLevelNode(editor.state.doc, nodePos);

            if (topLevelNode !== currentNode) {
              const blockStartPos = getBlockStartPos(editor.state.doc, nodePos);
              currentNode = topLevelNode;
              currentPos = blockStartPos;
              relativePosition = positionToRelativePosition(view.state, currentPos);
              null == onNodeChange || onNodeChange({ editor, node: currentNode, pos: currentPos });
              tippyInstance.setProps({ getReferenceClientRect: () => domNode.getBoundingClientRect() });
              tippyInstance.show();
            }
            return false;
          }
        }
      }
    });
};

const DragHandle = Extension.create({
  name: "dragHandle",
  addOptions: () => ({
    render() {
      const dragHandleElement = document.createElement("div");
      return dragHandleElement.classList.add("drag-handle"), dragHandleElement;
    },
    tippyOptions: {},
    locked: false,
    onNodeChange: () => null
  }),
  addCommands() {
    return {
      lockDragHandle: () => ({ editor }) => (
        this.options.locked = true,
        editor.commands.setMeta("lockDragHandle", this.options.locked)
      ),
      unlockDragHandle: () => ({ editor }) => (
        this.options.locked = false,
        editor.commands.setMeta("lockDragHandle", this.options.locked)
      ),
      toggleDragHandle: () => ({ editor }) => (
        this.options.locked = !this.options.locked,
        editor.commands.setMeta("lockDragHandle", this.options.locked)
      )
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