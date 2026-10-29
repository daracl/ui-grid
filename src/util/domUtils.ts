import { hasClass, getBrowserSize, getScrollPosition, outerLayerPosition } from '@daracl/core/utils';
export { hasClass, getBrowserSize, getScrollPosition, outerLayerPosition };

import { ALL_ICONS } from '@/constantIcons';
import { LAYER_ATTR_NAME } from '@/constants';

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
    throw new Error('Invalid element.');
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
 @param {HTMLElement | HTMLElement[]} element element
 * @param {...string[]} attrKey attribute key
 */
export function removeAttr(element: HTMLElement | HTMLElement[], ...attrKey: string[]) {
  let elements;
  if (element instanceof HTMLElement) {
    elements = [element];
  } else {
    elements = element;
  }

  elements.forEach((ele) => {
    for (const attr of attrKey) {
      ele.removeAttribute(attr);
    }
  });
}
export function $getElements(el: Element | string | Element[] | NodeListOf<Element> | null): Element[] {
  if (!el) return [];

  if (Array.isArray(el)) {
    return el;
  }

  if (el instanceof Element) {
    return [el];
  }

  if (el instanceof NodeList) {
    return Array.from(el);
  }

  return Array.from(document.querySelectorAll(el));
}
/**
 * HTML 요소를 생성하고, 클래스와 속성을 설정하는 유틸 함수
 *
 * @param tagName - 생성할 HTML 요소의 태그 이름 (예: 'div', 'span')
 * @param className - 요소에 적용할 클래스 이름 (선택 사항)
 * @param attrs - 요소에 추가할 속성 객체 (예: { id: 'my-id', 'data-role': 'layer' })
 * @returns 생성된 HTMLElement
 */
export function createHTMLElement(tagName: string, className?: string, attrs: any = {}): HTMLElement {
  // 1. 지정된 태그 이름으로 HTML 요소 생성
  const element = document.createElement(tagName);

  // 2. className이 제공되면 요소에 클래스 설정
  if (className) {
    element.className = className;
  }

  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'object' && value !== null) {
      // style, dataset 등 객체인 경우
      if (key === 'style') {
        Object.assign(element.style, value);
      } else if (key === 'dataset') {
        Object.assign(element.dataset, value);
      } else {
        // 기타 객체는 JSON 문자열로 저장
        element.setAttribute(key, JSON.stringify(value));
      }
    } else {
      // 일반 문자열, 숫자 등
      element.setAttribute(key, String(value));
    }
  }

  // 4. 완성된 요소 반환
  return element;
}

/**
 * get layer element
 * @param tagName layer tag
 * @param className class name
 * @param layerName layer name
 * @returns
 */
export function getLayerElement(tagName: string, className: string, layerName: string): HTMLElement {
  return createHTMLElement(tagName, className, { [LAYER_ATTR_NAME]: layerName });
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

export function getIcon(name: string): string {
  return ALL_ICONS[name as keyof typeof ALL_ICONS] ?? '';
}
