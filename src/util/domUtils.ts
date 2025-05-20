import { styleClassSplit } from "./styleUtils";

export function hasClass(element: HTMLElement, styleClass: string) {
  const styleClassArr = styleClassSplit(styleClass);

  for (let styleClassItem of styleClassArr) {
    if (element.classList.contains(styleClassItem)) {
      return true;
    }
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
