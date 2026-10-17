export declare class DaraElement {
    private readonly element;
    constructor(element: HTMLElement | null);
    findDaraElement(selector: string): DaraElement;
    find(selector: string): HTMLElement;
    finds(selector: string): HTMLElement[];
    before(renderElements: HTMLElement | string): void;
    after(renderElements: HTMLElement | string): void;
    prepend(renderElements: HTMLElement | string): void;
    append(renderElements: HTMLElement | string): void;
    text(text: any): string | null | undefined;
    html(text: string): string | undefined;
    getElement(): HTMLElement;
    empty(): this;
    /**
     * 보더, 패딩, 스크롤바를 포함한 전체 크기
     *
     * @returns {number} height
     */
    height(): number;
    setHeight(height: number): void;
    /**
     * 패딩을 포함한 콘텐츠 영역의 높이
     *
     * @returns {number} height
     */
    clientHeight(): number;
    show(): this;
    hide(): this;
    /**
     * 패딩과 보더를 포함한 전체 높이
     *
     * @returns {number} height
     */
    offsetHeight(): number;
    /**
     * 보더, 패딩, 스크롤바를 포함한 전체 크기
     *
     * @returns {number} width
     */
    width(): number;
    /**
     * 패딩을 포함한 콘텐츠 영역의 넓이
     *
     * @returns {number} width
     */
    clientWidth(): number;
    /**
     * 패딩과 보더를 포함한 전체 넓이
     *
     * @returns {number} width
     */
    offsetWidth(): number;
    /**
     * element css class check
     *
     * @param {string} checkClass check css class
     * @returns {boolean} contains = true, flase
     */
    hasClass(checkClass: string): boolean;
    /**
     * add element css class
     *
     * @param {string} addClasses css class
     */
    addClass(...addClasses: string[]): void;
    /**
     * remove element css class
     *
     * @param {string} removeClasses css class
     */
    removeClass(...removeClasses: string[]): void;
    insertAdjacentHTML(insertPosition: InsertPosition, renderElements: HTMLElement | string): void;
    /**
     * get attribute value
     *
     * @param {string} attrKey attribute key
     * @returns {*} attribute value
     */
    getAttr(attrKey: string): string | null;
    /**
     * set attribute
     * @param attrs element attribute object
     * @returns DaraElement
     */
    setAttr(attrs: any): this;
    /**
     * remove attribute
     * @param attrKey element attribute keys ["class","style"]
     * @returns this
     */
    removeAttr(...attrKey: string[]): this;
    /**
     * css
     *
     * @param cssValueObject  css value object
     * @returns
     */
    css(attrs: any): this;
    /**
     * css
     *
     * @param cssValueObject  css value object
     * @returns
     */
    removeCss(csskeys: string[]): this;
}
