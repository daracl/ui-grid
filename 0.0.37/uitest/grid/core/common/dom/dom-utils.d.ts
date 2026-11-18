type ElementType = Element | string | NodeList | Document | Element[] | null | undefined;
/**
 * DOM 셀럭터 리스트 반환. 배열은 노드가 아닌 항목(null, undefined 등)을 제외한 새 배열을 반환합니다.
 *
 * @export
 * @param {(Element | string | NodeList | Document | Element[])} el
 * @returns {Node[]}
 */
export declare function $querySelectorList(el: ElementType): Node[];
/**
 * 첫 번째 Element 또는 Document 를 반환합니다. 대상이 없으면(빈 배열·빈 NodeList 포함) null 입니다.
 */
export declare function $querySelector(el: ElementType): Document | Element | null;
/**
 * 주어진 요소의 위치 및 크기를 반환합니다.
 *
 * @param el - 위치를 구할 HTML 요소
 * @param includeScroll - true이면 문서 전체 기준 좌표 (스크롤 보정 포함), false이면 뷰포트 기준 좌표
 * @returns 요소의 top, left, right, bottom, width, height 정보를 포함한 객체
 */
export declare function getElementRect(el: Element, includeScroll?: boolean): {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
};
/**
 *
 * @export
 * @param {ElementType} el
 * @param {(Element | string)} renderElements
 */
export declare function before(el: ElementType, renderElements: Element | string): void;
export declare function after(el: ElementType, renderElements: Element | string): void;
export declare function prepend(el: ElementType, renderElements: Element | string): void;
export declare function append(el: ElementType, renderElements: Element | string): void;
/**
 * 상위 요소 탐색 유틸
 *
 * @param el - 탐색 시작 요소
 * @param check - CSS 선택자 문자열 또는 상위 Element 객체
 * @returns 조건에 맞는 상위 요소(Element) 또는 null
 */
export declare function findClosest(el: Element, check: string | Element): Element | null;
export {};
