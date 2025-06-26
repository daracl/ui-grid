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

/**
 * add attribute
 * @param attrs element attribute object
 * @returns DaraElement
 */
export function addAttr(el: HTMLElement, attrs: any) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

/**
 * remove html element attribute
 *
 * @param {HTMLElement} el element
 * @param {...string[]} attrKey attribute key
 */
export function removeAttr(element: HTMLElement | NodeList, ...attrKey: string[]) {
  let elements;
  if (element instanceof HTMLElement) {
    elements = [element];
  } else {
    elements = element;
  }

  elements.forEach((ele) => {
    for (let attr of attrKey) {
      (ele as HTMLElement).removeAttribute(attr);
    }
  });
}
