import { styleClassSplit } from "../util/styleUtils";
import { isString, isUndefined } from "../util/utils";

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

  before(renderElements: HTMLElement) {
    this.insertAdjacentHTML("beforebegin", renderElements);
  }
  after(renderElements: HTMLElement) {
    this.insertAdjacentHTML("afterend", renderElements);
  }
  prepend(renderElements: HTMLElement) {
    this.insertAdjacentHTML("afterbegin", renderElements);
  }
  append(renderElements: HTMLElement) {
    this.insertAdjacentHTML("beforeend", renderElements);
  }

  text(text: string) {
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
   * @param {string} styleClasss css class
   */
  addClass(styleClasss: string) {
    const classList = this.element.classList;

    for (let className of styleClassSplit(styleClasss)) {
      if (!classList.contains(className)) {
        classList.add(className);
      }
    }
  }

  /**
   * remove element css class
   *
   * @param {string} styleClasss css class
   */
  removeClass(styleClasss: string) {
    const classList = this.element.classList;

    for (let className of styleClassSplit(styleClasss)) {
      if (!classList.contains(className)) {
        classList.remove(className);
      }
    }
  }

  eventOn(type: string, selector: any, listener: any) {
    const element = this.element;

    if (!isString(selector)) {
      listener = selector;

      for (let eventType of type.split(" ")) {
        element.addEventListener(eventType, (e) => {
          if (listener(e, element) === false) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }

      return this;
    }

    const fn = (e: Event) => {
      const evtTarget = e.target;

      const selectorEle = (evtTarget as HTMLElement)?.closest(selector);

      if (selectorEle) {
        if (listener(e, selectorEle) === false) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }
    };

    element.addEventListener(type, fn);
  }

  insertAdjacentHTML(insertPosition: InsertPosition, renderElements: HTMLElement | string) {
    if (isString(renderElements)) {
      this.element.insertAdjacentHTML(insertPosition, renderElements);
    } else {
      this.element.insertAdjacentElement(insertPosition, renderElements);
    }
  }
}
