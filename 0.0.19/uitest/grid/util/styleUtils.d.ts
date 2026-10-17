import { OptionCallback } from '../types/Common.js';
import { FieldItem } from '../types/GridField.js';
import { RendererInfo } from '../types/RendererInfo.js';
/**
 * @method addStyleTag
 * @param options {Object} - 데이터 .
 * @description  add style tab
 */
export declare const addStyleTag: (instanceId: string) => void;
/**
 * style class split
 * @example
 * ```
 * 'a b c' => ['a','b','c']
 * ```
 * @param {string} classNames
 * @returns {*}
 */
export declare const styleClassSplit: (classNames?: string) => string[];
/**
 * add element css class
 *
 * @param {string} classes css class
 */
export declare function addClass(element: Element | null | Element[] | NodeListOf<Element>, ...classes: string[]): void;
/**
 * remove element css class
 *
 * @export
 * @param {(Element | null | Element[] | NodeListOf<Element>)} element
 * @param {...string[]} classNames class names
 */
export declare function removeClass(element: Element | null | Element[] | NodeListOf<Element>, ...classNames: string[]): void;
/**
 * toggleClass
 *
 * 지정된 DOM 요소(또는 요소 리스트)에 하나 이상의 클래스를 토글(add/remove)합니다.
 *
 * @param element - 단일 Element 또는 NodeListOf<Element> 또는 null
 * @param classNames - 공백으로 구분된 하나 이상의 클래스 이름
 */
export declare function toggleClass(element: Element | null | Element[], classNames: string): void;
/**
 * 주어진 HTMLElement에 여러 CSS 속성을 한 번에 적용하는 함수
 *
 * @param element - 스타일을 적용할 HTML 요소
 * @param styles - 적용할 스타일 객체 (예: { color: 'red', 'font-size': '16px' })
 */
export declare function addStyleCss(element: HTMLElement, styles: any): void;
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
export declare function normalizeCssLength(value: number | string): string;
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
export declare const resolveClassName: (className: string | OptionCallback | undefined, params?: any) => string[];
/**
 * Get white-space style information for a field.
 *
 * Returns the CSS style string and class name to apply based on the
 * field's `whiteSpace` option.
 *
 * @param field field information
 * @returns white-space style and class name
 */
export declare const getWhiteSpaceInfo: (field: FieldItem) => {
    style: string;
    className: string;
};
/**
 * Get renderer variant class name.
 *
 * @public
 * @param {RendererInfo} renderer field info
 * @returns {string} renderer variant class name
 */
export declare const getRendererVariantClass: (renderer: RendererInfo) => string;
