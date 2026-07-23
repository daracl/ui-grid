import { OptionCallback } from '@/types/Common';
import { $getElements } from './domUtils';
import { isFunction } from './utils';

/**
 * @method addStyleTag
 * @param options {Object} - 데이터 .
 * @description  add style tab
 */
export const addStyleTag = (instanceId: string) => {
  const cssStr: string[] = [];

  let styleTag = document.querySelector(`[dg-style-id="${instanceId}"]`) as HTMLStyleElement;

  if (!styleTag) {
    styleTag = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleTag);
    styleTag.setAttribute('dg-style-id', instanceId);
    styleTag.setAttribute('type', 'text/css');
  }

  if (styleTag.style) {
    styleTag.style.cssText = cssStr.join('');
  } else {
    styleTag.innerHTML = cssStr.join('');
  }
};

/**
 * style class split
 * @example
 * ```
 * 'a b c' => ['a','b','c']
 * ```
 * @param {string} classNames
 * @returns {*}
 */
export const styleClassSplit = (classNames: string) => {
  return classNames.trim().split(/\s+/);
};

/**
 * add element css class
 *
 * @param {string} classes css class
 */
export function addClass(element: Element | null | Element[] | NodeListOf<Element>, ...classes: string[]): void {
  if (!element) return;

  const elements = $getElements(element);

  elements.forEach((el) => {
    el.classList.add(...classes); // 중복 자동 처리
  });
}

/**
 * remove element css class
 *
 * @export
 * @param {(Element | null | Element[] | NodeListOf<Element>)} element
 * @param {...string[]} classNames class names
 */
export function removeClass(element: Element | null | Element[] | NodeListOf<Element>, ...classNames: string[]): void {
  if (!element || classNames.length < 1) return;

  const elements = $getElements(element);

  for (const el of elements) {
    el.classList.remove(...classNames);
  }
}

/**
 * toggleClass
 *
 * 지정된 DOM 요소(또는 요소 리스트)에 하나 이상의 클래스를 토글(add/remove)합니다.
 *
 * @param element - 단일 Element 또는 NodeListOf<Element> 또는 null
 * @param classNames - 공백으로 구분된 하나 이상의 클래스 이름
 */
export function toggleClass(element: Element | null | Element[], classNames: string): void {
  if (!element || typeof classNames !== 'string') return;

  const elements = $getElements(element);
  const classes = styleClassSplit(classNames);

  for (const el of elements) {
    classes.forEach((cls) => {
      el.classList.toggle(cls);
    });
  }
}

/**
 * 주어진 HTMLElement에 여러 CSS 속성을 한 번에 적용하는 함수
 *
 * @param element - 스타일을 적용할 HTML 요소
 * @param styles - 적용할 스타일 객체 (예: { color: 'red', 'font-size': '16px' })
 */
export function addStyleCss(element: HTMLElement, styles: any) {
  for (const key in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, key)) {
      element.style.setProperty(key, styles[key]);
    }
  }
}

/**
 * CSS length 값을 정규화합니다.
 *
 * 숫자 값은 기본 단위인 px을 추가하고,
 * 이미 CSS 단위가 포함된 문자열 값은 그대로 반환합니다.
 *
 * @example
 * normalizeCssLength(10) // "10px"
 * normalizeCssLength("10rem") // "10rem"
 */
export function normalizeCssLength(value: number | string) {
  if (!value) return '';
  return typeof value === 'number' || /^\d+$/.test(value) ? `${value}px` : value;
}

/**
 * Resolve class name value.
 *
 * className이 callback 함수인 경우 params를 전달하여 실행한 결과를 반환하고,
 * 문자열인 경우 그대로 반환한다.
 *
 * @param {string | OptionCallback | undefined} className
 *        클래스명 또는 클래스명을 반환하는 callback
 * @param {any} [params]
 *        callback 실행 시 전달할 파라미터
 *
 * @returns {string}
 *        resolved class name
 */
export const resolveClassName = (className: string | OptionCallback | undefined, params?: any): string => {
  return isFunction(className) ? className(params) : className ?? '';
};
