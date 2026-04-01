import { LAYER_ATTR_NAME } from '@/constants';
import { styleClassSplit } from './styleUtils';
import { isArray } from './utils';

export function hasClass(element: HTMLElement, styleClass: string) {
  const styleClassArr = styleClassSplit(styleClass);

  const classList = element.classList;
  for (const styleClassItem of styleClassArr) {
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
  includeScroll = false,
): {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
} {
  if (!el) {
    throw new Error('유효하지 않은 요소입니다.');
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
  for (const key in attrs) {
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
    for (const attr of attrKey) {
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

  for (const node of nodeList) {
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

export function innerLayerPosition(
  renderContainer: HTMLElement,
  targetElement: HTMLElement,
  layerElement: HTMLElement,
  margin = 2,
) {
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
  const scrollPostion = getScrollPosition();
  const scrollTop = scrollPostion.top;
  const scrollLeft = scrollPostion.left;

  const rect = getElementRect(layerEl);

  const layerWidth = rect.width;
  const layerHeight = rect.height;

  const browserSize = getBrowserSize();

  const targetX = evtPosition.x;
  const targetY = evtPosition.y;

  const bottom = scrollTop + browserSize.height,
    right = scrollLeft + browserSize.width;

  const layerBottomMargin = 5;

  //console.log(`targetX : ${targetX}, targetY : ${targetY}, right : ${right}, bottom : ${bottom}, scrollTop : ${scrollTop}, windowHeight: ${windowHeight}, layerHeight:${layerHeight}, layerWidth:${layerWidth} `);

  let top = targetY + layerHeight + layerBottomMargin > bottom ? bottom - (layerHeight + layerBottomMargin) : targetY;
  top = Math.max(top, 0);

  let left = targetX + layerWidth > right ? targetX - layerWidth : targetX;
  left = Math.max(left, 0);

  return { top, left };
}

/**
 * 스크롤바가 차지하는 영역을 제외한 브라우저의 실제 사용 가능한 크기를 반환합니다.
 * (뷰포트 크기 - 스크롤바 크기)
 *
 * @returns { width: number, height: number }
 */
export function getBrowserSize(usableSize = true) {
  // 전체 뷰포트 크기 (스크롤바 포함)
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 실제 컨텐츠 렌더링 가능한 크기 (스크롤바 제외)
  let scrollbarWidth = 0;
  let scrollbarHeight = 0;
  if (usableSize) {
    const documentElement = document.documentElement;
    // 스크롤바 너비 = 전체 뷰포트 - 렌더링 영역
    scrollbarWidth = windowWidth - documentElement.clientWidth;
    scrollbarHeight = windowHeight - documentElement.clientHeight;
  }

  return {
    width: windowWidth - scrollbarWidth,
    height: windowHeight - scrollbarHeight,
  };
}

/**
 * 현재 문서의 스크롤 위치를 반환합니다.
 *
 * @returns { top: number, left: number }
 */
export function getScrollPosition(): { top: number; left: number } {
  const top =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : document.documentElement.scrollTop || document.body.scrollTop || 0;

  const left =
    window.pageXOffset !== undefined
      ? window.pageXOffset
      : document.documentElement.scrollLeft || document.body.scrollLeft || 0;

  return { top, left };
}
