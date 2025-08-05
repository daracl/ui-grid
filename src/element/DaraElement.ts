import { eventOff, eventOn } from "src/util/eventUtils";
import { styleClassSplit } from "../util/styleUtils";
import { isBlank, isString, isUndefined } from "../util/utils";

export default class DaraElement {
  private readonly element: HTMLElement;

  constructor(element: HTMLElement | null) {
    if (element != null) {
      this.element = element;
    }
  }

  findDaraElement(selector: string): DaraElement {
    return new DaraElement(this.element.querySelector(selector));
  }

  find(selector: string): HTMLElement {
    return this.element.querySelector(selector) as HTMLElement;
  }

  finds(selector: string) {
    return this.element.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  }

  before(renderElements: HTMLElement | string) {
    this.insertAdjacentHTML("beforebegin", renderElements);
  }

  after(renderElements: HTMLElement | string) {
    this.insertAdjacentHTML("afterend", renderElements);
  }

  prepend(renderElements: HTMLElement | string) {
    this.insertAdjacentHTML("afterbegin", renderElements);
  }

  append(renderElements: HTMLElement | string) {
    this.insertAdjacentHTML("beforeend", renderElements);
  }

  text(text: any) {
    if (isUndefined(text)) {
      return this.element.textContent;
    }

    this.element.innerText = text;
  }

  html(text: string) {
    if (isUndefined(text)) {
      return this.element.outerHTML;
    }

    this.empty();

    if (isBlank(text)) return;

    this.element.innerHTML = text;
  }

  getElement() {
    return this.element;
  }

  empty() {
    if (this.element == null) return this;

    this.element.replaceChildren();

    return this;
  }

  /**
   * 보더, 패딩, 스크롤바를 포함한 전체 크기
   *
   * @returns {number} height
   */
  height() {
    return this.element.getBoundingClientRect().height;
  }

  setHeight(height: number) {
    this.element.style.height = height + "px";
  }

  /**
   * 패딩을 포함한 콘텐츠 영역의 높이
   *
   * @returns {number} height
   */
  clientHeight() {
    return this.element.clientHeight;
  }

  show() {
    this.element.style.display = "block";
    return this;
  }

  hide() {
    this.element.style.display = "none";
    return this;
  }

  /**
   * 패딩과 보더를 포함한 전체 높이
   *
   * @returns {number} height
   */
  offsetHeight() {
    return this.element.offsetHeight;
  }

  /**
   * 보더, 패딩, 스크롤바를 포함한 전체 크기
   *
   * @returns {number} width
   */
  width() {
    return this.element.getBoundingClientRect().width;
  }

  /**
   * 패딩을 포함한 콘텐츠 영역의 넓이
   *
   * @returns {number} width
   */
  clientWidth() {
    return this.element.clientWidth;
  }

  /**
   * 패딩과 보더를 포함한 전체 넓이
   *
   * @returns {number} width
   */
  offsetWidth() {
    return this.element.offsetWidth;
  }

  /**
   * element css class check
   *
   * @param {string} styleClass check css class
   * @returns {boolean} contains = true, flase
   */
  hasClass(styleClass: string) {
    if (this.element.classList.contains(styleClass)) {
      return true;
    }

    return false;
  }

  /**
   * add element css class
   *
   * @param {string} styleClass css class
   */
  addClass(styleClass: string) {
    const classList = this.element.classList;

    for (let className of styleClassSplit(styleClass)) {
      if (!classList.contains(className)) {
        classList.add(className);
      }
    }
  }

  /**
   * remove element css class
   *
   * @param {string} styleClass css class
   */
  removeClass(styleClass: string) {
    const classList = this.element.classList;

    for (let className of styleClassSplit(styleClass)) {
      if (classList.contains(className)) {
        classList.remove(className);
      }
    }
  }

  eventOff(type: string) {
    eventOff(this.element, type);
    return this;
  }

  eventOn(type: string, listener: any, selector?: any, fnOpts?: any) {
    eventOn(this.element, type, listener, selector, fnOpts);
    return this;
  }

  insertAdjacentHTML(insertPosition: InsertPosition, renderElements: HTMLElement | string) {
    if (isString(renderElements)) {
      this.element.insertAdjacentHTML(insertPosition, renderElements);
    } else {
      this.element.insertAdjacentElement(insertPosition, renderElements);
    }
  }

  /**
   * get attribute value
   *
   * @param {string} attrKey attribute key
   * @returns {*} attribute value
   */
  getAttr(attrKey:string){
    return this.element.getAttribute(attrKey);
  }

  /**
   * set attribute
   * @param attrs element attribute object
   * @returns DaraElement
   */
  setAttr(attrs: any) {
    for (let key in attrs) {
      this.element.setAttribute(key, attrs[key]);
    }

    return this;
  }

  /**
   * remove attribute
   * @param attrKey element attribute keys ["class","style"]
   * @returns this
   */
  removeAttr(...attrKey: string[]) {
    for (let key of attrKey) {
      this.element.removeAttribute(key);
    }

    return this;
  }

  /**
   * css
   *
   * @param cssValueObject  css value object
   * @returns
   */
  css(attrs: any) {
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        this.element.style.setProperty(key, attrs[key]);
      }
    }

    return this;
  }

  /**
   * css
   *
   * @param cssValueObject  css value object
   * @returns
   */
  removeCss(csskeys: string[]) {
    for (let key in csskeys) {
      this.element.style.removeProperty(key);
    }

    return this;
  }
}
