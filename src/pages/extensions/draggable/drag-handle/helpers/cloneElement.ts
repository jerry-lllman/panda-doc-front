function getAllComputedStyles(element: Element): string {
  let cssText = "";
  const computedStyle = getComputedStyle(element);
  for (let i = 0; i < computedStyle.length; i += 1) {
    const property = computedStyle[i];
    cssText += `${property}:${computedStyle.getPropertyValue(property)};`;
  }
  return cssText;
}

export function cloneElement(element: HTMLElement): HTMLElement {
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