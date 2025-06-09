import { Editor } from "@tiptap/react";
import { Node } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import {
  ySyncPluginKey,
  absolutePositionToRelativePosition,
} from "y-prosemirror";
import type { FindElementAndNodeResult, FindElementAndNodeParams, RelativePosition } from "../types";

export function findElementAndNode({ x, y, direction, editor }: FindElementAndNodeParams): FindElementAndNodeResult {
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
}

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

export function getBlockStartPos(doc: Node, pos: number): number {
  const resolvedPos = doc.resolve(pos);
  const { depth } = resolvedPos;
  if (0 === depth) return pos;
  return resolvedPos.pos - resolvedPos.parentOffset - 1;
}

export function getTopLevelNode(doc: Node, pos: number): Node | null {
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
}

export function positionToRelativePosition(state: EditorState, pos: number): RelativePosition | null {
  const ySyncState = ySyncPluginKey.getState(state);
  return ySyncState ? absolutePositionToRelativePosition(pos, ySyncState.type, ySyncState.binding.mapping) : null;
} 