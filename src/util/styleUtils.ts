import DaraGrid from "src/DaraGrid";
import { $querySelector } from "./domUtils";

/**
 * @method addStyleTag
 * @param options {Object} - 데이터 .
 * @description  add style tab
 */
export const addStyleTag = (grid: DaraGrid) => {
  const options = grid.getOptions();

  const cssStr: string[] = [];

  const instanceId = grid.instanceId();
  let styleTag = document.querySelector(`[dg-style-id="${instanceId}"]`) as HTMLStyleElement;

  if (styleTag) {
  } else {
    styleTag = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleTag);
    styleTag.setAttribute("dg-style-id", instanceId);
    styleTag.setAttribute("type", "text/css");
  }

  if (styleTag.style) {
    styleTag.style.cssText = cssStr.join("");
  } else {
    styleTag.innerHTML = cssStr.join("");
  }
};

/**
 * style class split
 * @example
 * ```
 * 'a b c' => ['a','b','c']
 * ```
 * @param {string} styleClass
 * @returns {*}
 */
export const styleClassSplit = (styleClass: string) => {
  return styleClass.trim().split(/\s+/);
};

/**
 * add element css class
 *
 * @param {string} styleClasss css class
 */
export function addClass(element: Element | NodeListOf<Element> | null | Element[], styleClass: string): void {
  if (!element) return;

  const elements = $querySelector(element);

  const addStyles = styleClassSplit(styleClass);

  elements.forEach((el) => {
    el.classList.add(...addStyles); // 중복 자동 처리
  });
}

/**
 * remove element css class
 *
 * @param {(HTMLElement | NodeListOf<Element>)} element html dom elements
 * @param {string} styleClass style css class
 */
export function removeClass(element: Element | NodeListOf<Element> | null | Element[], classNames: string): void {
  if (!element || typeof classNames !== "string") return;

  const elements = $querySelector(element);

  const styleClasses = styleClassSplit(classNames);

  for (const el of elements) {
    el.classList.remove(...styleClasses);
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
export function toggleClass(element: Element | NodeListOf<Element> | null | Element[], classNames: string): void {
  if (!element || typeof classNames !== "string") return;

  const elements = $querySelector(element);
  const styleClasses = styleClassSplit(classNames);

  for (const el of elements) {
    styleClasses.forEach((cls) => {
      el.classList.toggle(cls);
    });
  }
}
