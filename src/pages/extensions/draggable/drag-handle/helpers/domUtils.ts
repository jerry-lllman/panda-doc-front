import { EditorView } from "@tiptap/pm/view";

export function getComputedStyleProperty(element: Element, property: keyof CSSStyleDeclaration): string {
  return window.getComputedStyle(element)[property] as string;
}

export function clamp(value: number = 0, min: number = 0, max: number = 0): number {
  return Math.min(Math.max(value, min), max);
}

export function removeElement(element: HTMLElement | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export function getConstrainedCoords(view: EditorView, x: number, y: number): { left: number; top: number } {
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

export function findParentDomNode(view: EditorView, element: Element): Element {
  let currentElement: Element | null = element;
  for (; currentElement && currentElement.parentNode && currentElement.parentNode !== view.dom;)
    currentElement = currentElement.parentNode as Element;
  return currentElement!;
} 