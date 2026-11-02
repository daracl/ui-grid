export declare function eqAttributeValue(element: HTMLElement, attr: string, value: string): boolean;
/**
 * add attribute
 * @param attrs element attribute object
 * @returns DaraElement
 */
export declare function addAttr(el: HTMLElement, attrs: any): void;
/**
 * remove html element attribute
 *
 * @param {HTMLElement} el element
 * @param {...string[]} attrKey attribute key
 */
export declare function removeAttr(element: Element | NodeList | Element[] | null | undefined, ...attrKey: string[]): void;
