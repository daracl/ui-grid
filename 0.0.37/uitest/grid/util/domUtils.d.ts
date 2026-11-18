import { hasClass, getBrowserSize, getScrollPosition, outerLayerPosition } from '@daracl/core/utils';
export { hasClass, getBrowserSize, getScrollPosition, outerLayerPosition };
export declare function eqAttributeValue(element: HTMLElement, attr: string, value: string): boolean;
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
 * add attribute
 * @param attrs element attribute object
 * @returns DaraElement
 */
export declare function addAttr(el: HTMLElement, attrs: any): void;
/**
 * remove html element attribute
 *
 @param {HTMLElement | HTMLElement[]} element element
 * @param {...string[]} attrKey attribute key
 */
export declare function removeAttr(element: HTMLElement | HTMLElement[], ...attrKey: string[]): void;
export declare function $getElements(el: Element | string | Element[] | NodeListOf<Element> | null): Element[];
/**
 * HTML 요소를 생성하고, 클래스와 속성을 설정하는 유틸 함수
 *
 * @param tagName - 생성할 HTML 요소의 태그 이름 (예: 'div', 'span')
 * @param className - 요소에 적용할 클래스 이름 (선택 사항)
 * @param attrs - 요소에 추가할 속성 객체 (예: { id: 'my-id', 'data-role': 'layer' })
 * @returns 생성된 HTMLElement
 */
export declare function createHTMLElement(tagName: string, className?: string, attrs?: any): HTMLElement;
/**
 * get layer element
 * @param tagName layer tag
 * @param className class name
 * @param layerName layer name
 * @returns
 */
export declare function getLayerElement(tagName: string, className: string, layerName: string): HTMLElement;
export declare function innerLayerPosition(renderContainer: HTMLElement, targetElement: HTMLElement, layerElement: HTMLElement, margin?: number): {
    top: number;
    left: number;
    height: number;
    width: number;
};
export declare function getIcon(name: string): string;
