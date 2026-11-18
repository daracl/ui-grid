/**
 * style class split
 * @example
 * ```
 * 'a b c' => ['a','b','c']
 * ```
 * @param {string} styleClass
 * @returns {*}
 */
export declare const styleClassSplit: (styleClass: string) => string[];
/**
 * add element css class
 *
 * @param {string} styleClasss css class
 */
export declare function addClass(element: Element | NodeListOf<Element> | null | Element[], styleClass: string): void;
/**
 * remove element css class
 *
 * @param {(HTMLElement | NodeListOf<Element>)} element html dom elements
 * @param {string} styleClass style css class
 */
export declare function removeClass(element: Element | NodeListOf<Element> | null | Element[], classNames: string): void;
/**
 * toggleClass
 *
 * 지정된 DOM 요소(또는 요소 리스트)에 하나 이상의 클래스를 토글(add/remove)합니다.
 *
 * @param element - 단일 Element 또는 NodeListOf<Element> 또는 null
 * @param classNames - 공백으로 구분된 하나 이상의 클래스 이름
 */
export declare function toggleClass(element: Element | NodeListOf<Element> | null | Element[], classNames: string): void;
/**
 * 주어진 HTMLElement에 여러 CSS 속성을 한 번에 적용하는 함수
 *
 * @param element - 스타일을 적용할 HTML 요소
 * @param styles - 적용할 스타일 객체 (예: { color: 'red', 'font-size': '16px' })
 */
export declare function addStyleCss(element: HTMLElement, styles: any): void;
