import { Editor } from "@tiptap/react";
import { getSelectionRanges } from "../../extension-node-range";
import { getConstrainedCoords } from "./domUtils";
import { findElementAndNode } from "./nodeUtils";

export function getSelectionRangesFromEvent(event: DragEvent, editor: Editor): ReturnType<typeof getSelectionRanges> {
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