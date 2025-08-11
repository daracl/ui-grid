import { LAYER_ATTR_NAME } from "src/constants";
import { styleClassSplit } from "./styleUtils";
import { isArray } from "./utils";

export function hasClass(element: HTMLElement, styleClass: string) {
  const styleClassArr = styleClassSplit(styleClass);

  const classList = element.classList;
  for (let styleClassItem of styleClassArr) {
    if (classList.contains(styleClassItem)) {
      return true;
    }
  }

  return false;
}

export function eqAttributeValue(element: HTMLElement, attr: string, value: string) {
  return element.getAttribute(attr) == value;
}

/**
 * 주어진 요소의 위치 및 크기를 반환합니다.
 *
 * @param el - 위치를 구할 HTML 요소
 * @param includeScroll - true이면 문서 전체 기준 좌표 (스크롤 보정 포함), false이면 뷰포트 기준 좌표
 * @returns 요소의 top, left, right, bottom, width, height 정보를 포함한 객체
 */
export function getElementRect(
  el: Element,
  includeScroll: boolean = false
): {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
} {
  if (!el) {
    throw new Error("유효하지 않은 요소입니다.");
  }

  const rect = el.getBoundingClientRect();
  const scrollX = includeScroll ? window.scrollX : 0;
  const scrollY = includeScroll ? window.scrollY : 0;

  return {
    top: rect.top + scrollY,
    left: rect.left + scrollX,
    bottom: rect.bottom + scrollY,
    right: rect.right + scrollX,
    width: rect.width,
    height: rect.height,
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

export function $querySelector(el: Element | string | NodeList | Document | Element[]): any[] {
  if (isArray(el)) {
    return el;
  }
  if (el instanceof Document) {
    return [document];
  }

  if (el instanceof Element) {
    return [el];
  }
  let nodeList;
  if (el instanceof NodeList) {
    nodeList = el;
  } else {
    nodeList = document.querySelectorAll(el);
  }

  const reval: Element[] = [];

  for (let node of nodeList) {
    reval.push(node as Element);
  }

  return reval;
}

/**
 * get layer element
 * @param tagName layer tag
 * @param className class name
 * @param layerName layer name
 * @returns
 */
export function getLayerElement(tagName: string, className: string, layerName: string): HTMLElement {
  const layerElement = document.createElement(tagName);
  layerElement.className = className;
  layerElement.setAttribute(LAYER_ATTR_NAME, layerName);
  return layerElement;
}

export function innerLayerPosition(renderContainer: HTMLElement, targetElement: HTMLElement, layerElement: HTMLElement, margin: number = 2) {
  const rendererContainer = getElementRect(renderContainer);
  const elementRect = getElementRect(targetElement);

  let layerHeight = layerElement.offsetHeight || getElementRect(layerElement).height;
  const windowBottom = window.innerHeight;

  // 버튼 위치를 #grid 기준으로 변환
  const gridTop = rendererContainer.top - elementRect.top;
  const menuOffsetBottom = elementRect.bottom + layerHeight;

  // 위로 띄울지 아래로 띄울지 결정
  const shouldOpenUpward = menuOffsetBottom > windowBottom;

  let top = elementRect.top - (layerHeight - margin);

  if (shouldOpenUpward) {
    top = elementRect.top - (layerHeight - margin);
    if (top < 0) {
      layerHeight = layerHeight - 5 + top;
    }

    if (windowBottom - elementRect.bottom > layerHeight) {
      layerHeight = windowBottom - elementRect.bottom - margin;
      top = elementRect.bottom - rendererContainer.top;
    } else {
      top = -(layerHeight + margin) - gridTop;
    }
  } else {
    top = elementRect.bottom - rendererContainer.top;
  }

  return {
    top: top,
    left: elementRect.left - rendererContainer.left,
    height: layerHeight,
    width: elementRect.width,
  };
}

/**
 * 레이어(layerEl)를 띄울 위치를 계산합니다.
 * 스크롤과 창 크기를 고려해 화면 밖으로 나가지 않도록 자동 조정됩니다.
 *
 * @param layerEl 띄울 레이어 DOM 요소
 * @param evtPosition event position (x, y)
 * @returns top, left 좌표 (픽셀 단위)
 */
export function outerLayerPosition(layerEl: HTMLElement, evtPosition: any) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const rect = getElementRect(layerEl);

  const layerWidth = rect.width;
  const layerHeight = rect.height;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const targetX = evtPosition.x;
  const targetY = evtPosition.y;

  const bottom = scrollTop + windowHeight,
    right = scrollLeft + windowWidth;

  //console.log(`targetX : ${targetX}, targetY : ${targetY}, right : ${right}, bottom : ${bottom}, scrollTop : ${scrollTop}, windowHeight: ${windowHeight}, layerHeight:${layerHeight}, layerWidth:${layerWidth} `);

  let top = targetY + layerHeight + 20 > bottom ? bottom - (layerHeight + 20) : targetY;
  top = top < 0 ? 0 : top;

  let left = targetX + layerWidth > right ? targetX - layerWidth : targetX;
  left = left < 0 ? 0 : left;

  return { top, left };
}

export function getBrowserSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
