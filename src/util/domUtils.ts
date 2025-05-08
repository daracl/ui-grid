import { isBlank, isEmpty, isString, isUndefined } from "src/util/utils";

export function hasClass(element: HTMLElement, styleClass: string) {
  if (element.classList.contains(styleClass)) {
    return true;
  }

  return false;
}

export function getOffset(el: HTMLElement): { top: number; left: number } {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}
